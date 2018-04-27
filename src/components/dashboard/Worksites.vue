<!--
<template>
  <div>
    <div class="card" style="margin-bottom: 0.5rem;">
      <div class="card-header">
        <div class="row">
          <div class="col-8">
            <h5>{{ $t('worksites.your_claimed_worksites') }}</h5>
          </div>
          <div class="col-4">
            <div class="text-md-right lead">
              <a class="btn btn-outline-secondary prev hand-pointer" @click="previousDashboardWorksites"
                 title="go back"><i class="fa fa-lg fa-chevron-left"></i></a>
              <a class="btn btn-outline-secondary next hand-pointer" @click="nextDashboardWorksites" title="more"><i
                class="fa fa-lg fa-chevron-right"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-loading loader="getDashboardWorksites">
      <template slot='spinner'>
        <div class="d-flex d-column justify-content-center align-items-center">
            <grid-loader :size="'90px'" :color="'white'"></grid-loader>
        </div>
      </template>
      <div class="row equal-height">
        <div class="col-12 col-md-6">
          <work-site :key="site.id" v-for="site in sitesCol1" :siteData="site"></work-site>
        </div>
        <div class="col-12 col-md-6">
          <work-site :key="site.id" v-for="site in sitesCol2" :siteData="site"></work-site>
        </div>
      </div>
    </v-loading>
  </div>
</template>

<script>
  import WorkSite from '../sites/WorkSite.vue';
  import {mapActions, mapGetters} from 'vuex';
  import GridLoader from "vue-spinner/src/GridLoader.vue";

  export default {
    name: 'worksites',
    computed: {
      sitesCol1() {
        return this.$store.getters.getDashboardWorksites.worksites.slice(0, 2);
      },
      sitesCol2() {
        return this.$store.getters.getDashboardWorksites.worksites.slice(2, 4);
      },
      ...mapGetters('loading', ['isLoading', 'anyLoading'])
    },
    mounted() {
      this.getDashboardWorksites();
    },
    components: {
      GridLoader,
      WorkSite,
      GridLoader
    },
    methods: {
      ...mapActions([
        'getDashboardWorksites',
        'nextDashboardWorksites',
        'previousDashboardWorksites'
      ])
    }
  }
</script>

<style scoped>
  .row.equal-height {
    display: flex;
    flex-wrap: wrap;
  }

  .row.equal-height > [class*='col-'] {
    display: flex;
    flex-direction: column;
  }

  .card {
    flex: 1;
  }

  .hand-pointer {
    cursor: pointer;
  }
</style>
-->

<template>
  <div class="animated fadeIn">
    <div class="card">

      <b-card no-body>
        <b-tabs pills card>

          <b-tab title="Open" active>

            <b-tabs pills card vertical>
              <b-tab title="Not Assigned" active>
                <!--Make table responsive-->
                <table class="table table-layout: fixed table-hover table-bordered">
                  <thead class="thead-dark text-center">
                  <th scope="col">Case Number</th>
                  <th scope="col">Name</th>
                  <th scope="col">Address</th>
                  <th scope="col">Work Type</th>
                  <th scope="col">Actions</th>
                  </thead>
                  <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>John Doe</td>
                    <td>123 Easy Sstreet</td>
                    <td>Muck Out</td>
                    <td>
                      BTN 1 BTN 2 BTN 3
                    </td>
                  </tr>
                  </tbody>
                </table>
              </b-tab>

              <b-tab title="Assigned">
                Tab Assigned contents
              </b-tab>
              <b-tab title="Partially Completed">
                Tab Assigned contents
              </b-tab>
              <b-tab title="Needs Follow Up">
                Tab Assigned contents
              </b-tab>
            </b-tabs>


          </b-tab>

          <b-tab title="Closed">

            <b-tabs pills card vertical nav-wrapper-class="w-1">
              <b-tab title="Not Assigned" active>
                <!--Make table responsive-->
                <table class="table table-layout: fixed table-hover table-bordered">
                  <thead class="thead-dark text-center">
                  <th scope="col">Case Number</th>
                  <th scope="col">Name</th>
                  <th scope="col">Address</th>
                  <th scope="col">Work Type</th>
                  <th scope="col">Actions</th>
                  </thead>
                  <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>John Doe</td>
                    <td>1234 Easy Street</td>
                    <td>Muck Out</td>
                    <td>Btn 1 Btn 2 Btn 3</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td colspan="2">Larry the Bird</td>
                    <td>@twitter</td>
                  </tr>
                  </tbody>
                </table>
              </b-tab>

              <b-tab title="Complete">
                Tab Assigned contents
              </b-tab>
              <b-tab title="Incomplete">
                Tab Assigned contents
              </b-tab>
              <b-tab title="Out of Scope">
                Tab Assigned contents
              </b-tab>
              <b-tab title="Done by Others">
                Tab Assigned contents
              </b-tab>
              <b-tab title="No Help Wanted">
                Tab Assigned contents
              </b-tab>
              <b-tab title="Rejected">
                Tab Assigned contents
              </b-tab>
              <b-tab title="Duplicate">
                Tab Assigned contents
              </b-tab>
            </b-tabs>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>


<script>
  import WorkSite from '../sites/WorkSite.vue';
  import {mapActions, mapGetters} from 'vuex';
  import GridLoader from "vue-spinner/src/GridLoader.vue";

  export default {
    name: 'worksites',
    computed: {
      sitesCol1() {
        return this.$store.getters.getDashboardWorksites.worksites.slice(0, 2);
      },
      sitesCol2() {
        return this.$store.getters.getDashboardWorksites.worksites.slice(2, 4);
      },
      ...mapGetters('loading', ['isLoading', 'anyLoading'])
    },
    mounted() {
      this.getDashboardWorksites();
    },
    components: {
      GridLoader,
      WorkSite,
      GridLoader
    },
    methods: {
      ...mapActions([
        'getDashboardWorksites',
        'nextDashboardWorksites',
        'previousDashboardWorksites'
      ])
    }
  }
</script>
