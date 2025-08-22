from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),

    path('zones/', views.ZoneListCreateView.as_view(), name='zone-list'),
    path('zones/<int:pk>/', views.ZoneDetailView.as_view(), name='zone-detail'),

    path('items/', views.ItemListCreateView.as_view(), name='item-list'),
    path('items/<int:pk>/', views.ItemDetailView.as_view(), name='item-detail'),

    path('movements/', views.StockMovementListCreateView.as_view(), name='movement-list'),
    path('movements/<int:pk>/', views.StockMovementDetailView.as_view(), name='movement-detail'),
]