from django.contrib import admin
from django.conf.urls import url
from mail_app import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^sigin/' ,views.sigin,name='sigin'),
    url(r'^logout/' ,views.logout,name='logout'),
    url(r'^dashboard/compose_email/',views.compose_email,name='compose_email'),
    url(r'^new_user_registrion/' ,views.new_user_registrion,name='new_user_registrion'),
    url(r'^save_new_user/' ,views.save_new_user,name='save_new_user'),
    url(r'^dashboard/inbox_messages/' ,views.inbox_messages,name='inbox_messages'),
    url(r'^message_detail/(\d+)/$', views.message_detail, name='message_detail'),
    url(r'^mark_as_read_or_unread/$', views.mark_as_read_or_unread, name='mark_as_read_or_unread'),
    url(r'^dashboard/sent_messages/' ,views.sent_messages,name='sent_messages'),      
]
