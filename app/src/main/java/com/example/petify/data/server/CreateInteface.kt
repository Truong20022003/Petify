package com.example.petify.data.server

import com.example.petify.data.server.service.CarrierService
import com.example.petify.data.server.service.CategoryService
import com.example.petify.data.server.service.InvoiceDetailService
import com.example.petify.data.server.service.InvoiceService
import com.example.petify.data.server.service.NotificationService
import com.example.petify.data.server.service.NotificationUserService
import com.example.petify.data.server.service.OrderService
import com.example.petify.data.server.service.ProductCategoryService
import com.example.petify.data.server.service.ProductService
import com.example.petify.data.server.service.ReviewProductService
import com.example.petify.data.server.service.ReviewService
import com.example.petify.data.server.service.RoleService
import com.example.petify.data.server.service.SupplierService
import com.example.petify.data.server.service.UserRoleService
import com.example.petify.data.server.service.UserService


object CreateInteface {
    const val DOMAIN = "http://localhost:3000/"
    fun createCarrier(): CarrierService {
        return NetworkModule<CarrierService>(DOMAIN).create(
            CarrierService::class.java
        )
    }

    fun createCategory(): CategoryService {
        return NetworkModule<CategoryService>(DOMAIN).create(
            CategoryService::class.java
        )
    }

    fun createInvoice(): InvoiceService {
        return NetworkModule<InvoiceService>(DOMAIN).create(
            InvoiceService::class.java
        )
    }

    fun createInvoiceDetail(): InvoiceDetailService {
        return NetworkModule<InvoiceDetailService>(DOMAIN).create(
            InvoiceDetailService::class.java
        )
    }

    fun createNotification(): NotificationService {
        return NetworkModule<NotificationService>(DOMAIN).create(
            NotificationService::class.java
        )
    }

    fun createNotificationUser(): NotificationUserService {
        return NetworkModule<NotificationUserService>(DOMAIN).create(
            NotificationUserService::class.java
        )
    }

    fun createOrder(): OrderService {
        return NetworkModule<OrderService>(DOMAIN).create(
            OrderService::class.java
        )
    }

    fun createProductCategory(): ProductCategoryService {
        return NetworkModule<ProductCategoryService>(DOMAIN).create(
            ProductCategoryService::class.java
        )
    }

    fun createProduct(): ProductService {
        return NetworkModule<ProductService>(DOMAIN).create(
            ProductService::class.java
        )
    }

    fun createReview(): ReviewService {
        return NetworkModule<ReviewService>(DOMAIN).create(
            ReviewService::class.java
        )
    }

    fun createReviewProduct(): ReviewProductService {
        return NetworkModule<ReviewProductService>(DOMAIN).create(
            ReviewProductService::class.java
        )
    }

    fun createRole(): RoleService {
        return NetworkModule<RoleService>(DOMAIN).create(
            RoleService::class.java
        )
    }

    fun createSupplier(): SupplierService {
        return NetworkModule<SupplierService>(DOMAIN).create(
            SupplierService::class.java
        )
    }

    fun createUserRole(): UserRoleService {
        return NetworkModule<UserRoleService>(DOMAIN).create(
            UserRoleService::class.java
        )
    }

    fun createUser(): UserService {
        return NetworkModule<UserService>(DOMAIN).create(
            UserService::class.java
        )
    }

}