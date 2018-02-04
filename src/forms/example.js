import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Full from '@/containers/Full'
import Main from '@/containers/Main'

import vueAuthInstance from '@/services/auth.js'
import i18n from '@/services/i18n';

Vue.use(Router);

const form_0 = {
  event_id: 0,
  preamble_t: "forms.preamble_default",
  last_updated: "2018-01-26",
  phase_pda: {
    is_active: false,
    allow_suggestions: true,
    allow_site_claim: false,
    allow_subsection_claim: false,
    fields: {
      not_created_info {
        field_type: "heading",
        validation: null,
        label_t: "formLabels.not_created_info",
        help_text_t: "formLabels.not_created_info_help",
        is_required: false,
        is_readonly: false,
        allow_edit_break_glass: true,
        allow_toggle_hiding: false,
        is_hidden_default: false,
        if_selected_then_work_type: null,
        fields {
        }
      }
    }
  },
  phase_cleanup: {
    is_active: true,
    allow_suggestions: true,
    allow_site_claim: true,
    allow_subsection_claim: false,
    fields: {
      propery_info {
        field_type: "heading",
        validation: null,
        label_t: "formLabels.property_info", /* If suggest, label_t = null */
        help_text_t: "formLabels.property_info_help",
        is_required: false,
        is_readonly: false,
        allow_edit_break_glass: true,
        allow_toggle_hiding: false,
        is_hidden_default: false, /***if type = hidden, this is true ***/
        if_selected_then_work_type: null,
        fields {
          request_date {
            field_type: "text",
            validation: "datetime-local",
            label_t: "formLabels.request_date",
            help_text_t: null,
            is_required: false,
            is_readonly: true,
            allow_edit_break_glass: true,
            allow_toggle_hiding: false,
            is_hidden_default: false,
            if_selected_then_work_type: null,
            placeholder: null /* text, textarea */
          },
          city_suggestion {
            field_type: "suggest",
            validation: "string",
            label_t: null, /* If suggest, label_t = null */
            help_text_t: null,
            is_required: false,
            is_readonly: true,
            allow_edit_break_glass: false,
            allow_toggle_hiding: false,
            is_hidden_default: true, /* If suggest, hidden by default */
            if_selected_then_work_type: null,
            placeholder: null /* text, textarea */
          },
          special_needs {
            field_type: "textarea",
            validation: "string",
            label_t: "formLabels.special_needs",
            help_text_t: "formLabels.special_needs_help",
            is_required: false,
            is_readonly: false,
            allow_edit_break_glass: true,
            allow_toggle_hiding: false,
            is_hidden_default: false,
            if_selected_then_work_type: null,
            placeholder: "formLabels.special_needs_placeholder" /* textarea */
          },
          latitude {
            field_type: "hidden",
            validation: "float",
            label_t: "formLabels.latitude",
            help_text_t: null,
            is_required: true,
            is_readonly: true,
            allow_edit_break_glass: true,
            allow_toggle_hiding: false,
            is_hidden_default: true
            if_selected_then_work_type: null,
          },
          residence_type {
            field_type: "select", /* And multiselect */
            validation: "string",
            label_t: "formLabels.residence_type",
            help_text_t: "formLabels.property_info_help",
            is_required: false,
            is_readonly: false,
            allow_edit_break_glass: true,
            allow_toggle_hiding: false,
            is_hidden_default: false,
            if_selected_then_work_type: null,
            options: [ /* for select, multiselect */
              {
                name_t: "actions.choose_one_select",
                value: null
              },
              {
                name_t: "formOptions.primary_living_in_home",
                value: "primary_living_in_home"
              },
              {
                name_t: "formOptions.primary_displaced_from_home",
                value: "primary_displaced_from_home"
              },
              {
                name_t: "formOptions.second_home",
                value: "second_home"
              },
              {
                name_t: "formOptions.guest_home",
                value: "guest_home"
              },
              {
                name_t: "formOptions.non_residence",
                value: "non_residence"
              }
            ]
          },
          work_without_resident {
            field_type: "checkbox",
            validation: "string",
            label_t: "formLabels.work_without_resident",
            help_text_t: "formLabels.work_without_resident",
            is_required: false,
            is_readonly: false,
            allow_edit_break_glass: true,
            allow_toggle_hiding: false,
            is_hidden_default: false,
            if_selected_then_work_type: null,
            options: [ /* for checkbox and radio */
              {
                name_t: "",
                value_null: null
              },
              {
                name_t: "formOptions.yes",
                value_checked: true
              },
              {
                name_t: "formOptions.no",
                value_unchecked: false
              }
            ]
          },
          work_without_resident {
            field_type: "select",
            validation: "string",
            label_t: "formLabels.work_without_resident",
            help_text_t: "formLabels.work_without_resident_help",
            is_required: false,
            is_readonly: false,
            allow_edit_break_glass: true,
            allow_toggle_hiding: false,
            is_hidden_default: false,
            if_selected_then_work_type: null,
          },
          etc {
            [attributes]
          },
          etc {
            [attributes]
          }
        }
      },
    }
  },
  phase_rebuild: {
    is_active: false,
    allow_suggestions: true,
    allow_site_claim: true,
    allow_subsection_claim: true,
    fields: {
      not_created_info {
        field_type: "heading",
        validation: null,
        label_t: "formLabels.not_created_info",
        help_text_t: "formLabels.not_created_info_help",
        is_required: false,
        is_readonly: false,
        allow_edit_break_glass: true,
        allow_toggle_hiding: false,
        is_hidden_default: false,
        if_selected_then_work_type: null,
        fields {
        }
      }
    }
  }
};

const router = new Router({
  mode: 'history',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({y: 0}),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return $('html,body').stop().animate({scrollTop: $(to.hash).offset().top - 70}, 1000);
    } else {
      return $('html,body').stop().animate({scrollTop: 0}, 500);
    }
  },
  routes: [
    {
      path: '/',
      redirect: '/map',
      name: 'public',
      component: Main,
      children: [
        {
          path: 'map',
          name: 'RealtimeMap',
          component: RealtimeMap
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500,
        },
        {
          path: 'login',
          name: 'Login',
          component: Login,
        },
        {
          path: 'roadmap',
          name: 'Roadmap',
          component: Roadmap,
        },
        {
          path: 'donate',
          name: 'Donate',
          component: Donate,
        },
        {
          path: 'register',
          name: 'Register',
          component: Register,
        },
        {
          path: 'register-organization',
          name: 'Register Organization',
          component: RegisterOrganization,
        }
      ]
    },
    {
      path: '/worker',
      redirect: '/worker/dashboard',
      name: 'Worker',
      component: Full,
      meta: {auth: true, title: 'Vue.Authenticate'},
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: WorkerDashboard,
          meta: {auth: true, title: i18n.t('router_index.dashboard_html_title')},
        },
        {
          path: 'map',
          name: 'WorkerMap',
          component: WorkerMapView,
          meta: {auth: true, title: i18n.t('router_index.worker_map_html_title')},
        },
        {
          path: 'my-organization',
          name: 'MyOrganization',
          component: MyOrganization,
          meta: {auth: true, title: i18n.t('router_index.my_organization_html_title')},
        },
        {
          path: 'charts',
          name: 'Charts',
          component: Charts,
          meta: {auth: true, title: i18n.t('router_index.charts_html_title')},
        },
      ]
    },
    { path: '*', name: 'Page404', component: Page404 }
  ]
});

router.beforeEach(function (to, from, next) {

  if (vueAuthInstance.isAuthenticated()) {
    store.commit('setCurrentUserId', vueAuthInstance.getPayload().user_id);
    store.commit('setCurrentOrgId', vueAuthInstance.getPayload().organization_id);
  }

  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }

  if (to.meta && to.meta.auth !== undefined) {
    if (to.meta.auth) {
      if (vueAuthInstance.isAuthenticated()) {
        next()
      } else {
        router.push({name: 'Login'})
      }
    } else {
      if (vueAuthInstance.isAuthenticated()) {
        router.push({name: 'Home'})
      } else {
        next()
      }
    }
  } else {
    next()
  }
});

export default router;