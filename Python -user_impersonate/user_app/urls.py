from django.contrib import admin
from django.conf.urls import url
from user_app import views

urlpatterns = [
    url(r'^$', views.sign_in, name='sign_in'),
    url(r'^logout/' ,views.logout,name='logout'),
    url(r'^new_user_registrion/' ,views.new_user_registrion,name='new_user_registrion'), 
    url(r'^dashboard/users_list/' ,views.get_user_data,name='user_list'), 
    url(r'^activate/(?P<uidb64>[0-9A-Za-z]+)/(?P<token>.+)$',views.activate_accout,name='activate'),
    url(r'^dashboard/users/$', views.user_dashboard, name='user_dashboard'),
    url(r'^dashboard/update_password/$', views.update_password, name='update_password'),
    url(r'^dashboard/delete_user/$', views.delete_user, name='delete_user'),
    url(r'^reset_password/(?P<uidb64>[0-9A-Za-z]+)/(?P<token>.+)/$', views.reset_password, name='reset_forget_password'),
    url(r'^forget_password/$', views.forget_password, name='forget_password'),
    url(r'^user_active_deactive/$', views.user_active_deactive, name='user_active_deactive'),
    url(r'^resend_activation_email/$', views.resend_activation_email, name='resend_activation_email'),
    url(r'^(\d+)/$',views.start_impersonate,name='impersonate-start'),
    url(r'^stop/$',views.stop_impersonate,name='impersonate_stop'),
]
