<template>
  <div class="fullsize-map" style="position: relative;">
    <div id="floating-panel">
      <button class="btn-primary" @click="toggleHeatmap()">{{ $t('workerCCUMap.toggle_heatmap') }}</button>
      <!--<button @click="changeGradient()">{{ $t('workerCCUMap.change_gradient') }}</button>-->
      <!--<button @click="changeRadius()">{{ $t('workerCCUMap.change_radius') }}</button>-->
      <!--<button @click="changeOpacity()">{{ $t('workerCCUMap.change_opacity') }}</button>-->
    </div>
    <gmap-map
      id="worker-map"
      :center="center"
      :zoom="zoomLevel"
      :options="options"
      style="width: 100%; height: 100%;"
      @click="mapIsClicked"
      @bounds_changed="mapBoundsChanged"
      @zoom_changed="setZoomLevel($event)"
      @dragstart="setDragging(true)"
      @dragend="setDragging(false)"
      ref="map"
    >
    </gmap-map>
  </div>
</template>

<script>

  import * as VueGoogleMaps from 'vue2-google-maps';
  import Vue from 'vue';
  import CCUMapEventHub from '../../events/CCUMapEventHub';
  import MarkerClusterer from 'marker-clusterer-plus';
  import {loaded} from 'vue2-google-maps'
  import generateMarkerImagePath from './utils/markerImageManager';
  import DashboardEventHub from '@/events/DashboardEventHub';
  import {style as mapStyle} from './styles/snowOrange';
  import { mapState, mapMutations, mapGetters } from 'vuex';

  let lodashArray = require('lodash/array');
  let lodashCollection = require('lodash/collection');

  export default {
    data() {
      return {
        options: {
          scrollwheel: false,
          styles: mapStyle,
          fullscreenControl: false
        },
        heatmap: null,
        points: [],
        markers: [],
        $markerCluster: null
      }
    },
    computed: {
      ...mapState('map', {
        center: state => state.center,
        zoomLevel: state => state.zoomLevel,
        dragging: state => state.dragging,
        bounds: state => state.bounds,
        tempMarkers: state => state.tempMarkers
      }),
      ...mapGetters([
        'getCurrentSiteData'
      ])
    },
    watch: {
      tempMarkers: function(val) {
        this.renderMarkers(this.$store.state.worker.mapViewingArea);
      },
    },
    mounted() {
      window.testObj1 = 'testing';
      loaded.then(() => {
        DashboardEventHub.$emit('open-aside', 'test');
        window.googMap = this.$refs.map;
        const eid = this.$store.state.worker.event.id;
        //this.centerMap(this.$store.state.map.center)
        this.$store.dispatch('map/getWorksites', eid).then((resp) => {
          this.renderMarkers();
        });
      });

      CCUMapEventHub.$on('site-search', (e) => {
        const currentSite = this.$store.getters.getCurrentSiteData;
        this.addMarker(currentSite);
        this.centerOnSiteWithZoom();
      });

      CCUMapEventHub.$on('re-render', (e) => {
        this.renderMarkers();
      });
    },
    beforeDestroy: function () {
      const a = {
        center: this.center,
        zoom: this.zoomLevel
      };
      this.$store.commit('setMapViewingArea', a);
      this.$markerCluster.clearMarkers();
    },
    methods: {
      ...mapMutations('map', ['setZoomLevel', 'setDragging', 'setMarkers', 'setCenter']),
      mapIsClicked() {
        CCUMapEventHub.$emit('map-is-clicked');
      },
      mapBoundsChanged(event) {
        const bounds = {
          minLon: event.b.b,
          minLat: event.f.b,
          maxLon: event.b.f,
          maxLat: event.f.f
        };
        this.$store.commit('map/setBounds', bounds);
      },
      mapCenterChanged(event) {
        this.$store.commit('map/setCenter', event);
      },
      draggingEnded(event) {
      },
      changeGradient() {
        const gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ];
        this.heatmap.set('gradient', this.heatmap.get('gradient') ? null : gradient);
      },
      changeRadius() {
        this.heatmap.set('radius', this.heatmap.get('radius') ? null : 20);
      },
      changeOpacity() {
        this.heatmap.set('opacity', this.heatmap.get('opacity') ? null : 0.2);
      },
      toggleHeatmap() {
        if (!this.heatmap) {
          this.heatmap = new google.maps.visualization.HeatmapLayer({
            data: this.points,
            map: this.$refs.map.$mapObject
          });
          this.heatmap.set('radius', 20);
        } else {
          this.heatmap.setMap(this.heatmap.getMap() ? null : this.$refs.map.$mapObject);
        }
      },
      centerOnSiteWithZoom() {
        this.centerOnSite();
        this.$store.commit('map/setZoomLevel', 12);
      },
      centerOnSite() {
        const currentSite = this.$store.getters.getCurrentSiteData;
        const latLng = new google.maps.LatLng(currentSite.lat, currentSite.lng);
        this.$refs.map.$mapObject.panTo(latLng);
      },
      centerMap(center) {
        const latLng = new google.maps.LatLng(center.lat, center.lng);
        this.$refs.map.$mapObject.panTo(latLng);
      },
      clearMarkers() {
        if (this.$markerCluster) {
          this.$markerCluster.clearMarkers();
        }
        if (this.markers.length > 0) {
          for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
          }
          this.markers = new Array();
        }
        if (this.points.length > 0) {
          for (let i = 0; i < this.points.length; i++) {
            this.points[i] = null;
          }
          this.points = new Array();
        }
      },
      addMarker(mark) {
        const markerCallback = (m, id) => {
          m.addListener('click', (e) => {
            const googleMarker = {
              id: id,
              marker: m
            };
            CCUMapEventHub.$emit('site-clicked', googleMarker);
            this.$store.commit('setActiveWorksiteView', {view: 'editWorksite'});
            this.$store.dispatch('getSite', googleMarker.id).then(() => {
              this.centerOnSite();
            });
          });
        };

        const latLng = new google.maps.LatLng(mark.lat, mark.lng);
        let marker = new google.maps.Marker({
          position: latLng,
          map: this.$refs.map.$mapObject,
          icon: generateMarkerImagePath(mark.claimed_by, mark.status, mark.work_type)
        });
        markerCallback(marker, mark.id);
        this.markers.push(marker);
        this.points.push(latLng);
        return marker;
      },
      renderMarkers() {
        this.clearMarkers();

        this.$markerCluster = new MarkerClusterer(
          this.$refs.map.$mapObject,
          []
        );

        let markers = this.tempMarkers.map((mark, i) => {
          return this.addMarker(mark);
        });
        this.$markerCluster.addMarkers(markers);

        // this.$store.commit('map/setGetMarkersFunc', function() {
        //   return this.markers;
        // })

      },
    }
  }
</script>

<style>
  #floating-panel {
    position: absolute;
    /*top: px;*/
    /*left: 50%;*/
    z-index: 5;
    /*background-color: #fff;*/
    padding: 5px;
    /*border: 1px solid #999;*/
    text-align: center;
    font-family: 'Roboto', 'sans-serif';
    line-height: 30px;
    padding-left: 10px;
    width: 10%;
    right: 0;
    margin: auto
  }

  .fullsize-map {
    height: 100%;
    width: 100%;
  }
</style>
