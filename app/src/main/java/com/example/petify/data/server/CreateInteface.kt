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
import com.example.petify.ultils.Constans


object CreateInteface {
    fun createCarrier(): CarrierService {
        return NetworkModule<CarrierService>(Constans.DOMAIN).create(
            CarrierService::class.java
        )
    }

    fun createCategory(): CategoryService {
        return NetworkModule<CategoryService>(Constans.DOMAIN).create(
            CategoryService::class.java
        )
    }

    fun createInvoice(): InvoiceService {
        return NetworkModule<InvoiceService>(Constans.DOMAIN).create(
            InvoiceService::class.java
        )
    }

    fun createInvoiceDetail(): InvoiceDetailService {
        return NetworkModule<InvoiceDetailService>(Constans.DOMAIN).create(
            InvoiceDetailService::class.java
        )
    }

    fun createNotification(): NotificationService {
        return NetworkModule<NotificationService>(Constans.DOMAIN).create(
            NotificationService::class.java
        )
    }

    fun createNotificationUser(): NotificationUserService {
        return NetworkModule<NotificationUserService>(Constans.DOMAIN).create(
            NotificationUserService::class.java
        )
    }

    fun createOrder(): OrderService {
        return NetworkModule<OrderService>(Constans.DOMAIN).create(
            OrderService::class.java
        )
    }

    fun createProductCategory(): ProductCategoryService {
        return NetworkModule<ProductCategoryService>(Constans.DOMAIN).create(
            ProductCategoryService::class.java
        )
    }

    fun createProduct(): ProductService {
        return NetworkModule<ProductService>(Constans.DOMAIN).create(
            ProductService::class.java
        )
    }

    fun createReview(): ReviewService {
        return NetworkModule<ReviewService>(Constans.DOMAIN).create(
            ReviewService::class.java
        )
    }

    fun createReviewProduct(): ReviewProductService {
        return NetworkModule<ReviewProductService>(Constans.DOMAIN).create(
            ReviewProductService::class.java
        )
    }

    fun createRole(): RoleService {
        return NetworkModule<RoleService>(Constans.DOMAIN).create(
            RoleService::class.java
        )
    }

    fun createSupplier(): SupplierService {
        return NetworkModule<SupplierService>(Constans.DOMAIN).create(
            SupplierService::class.java
        )
    }

    fun createUserRole(): UserRoleService {
        return NetworkModule<UserRoleService>(Constans.DOMAIN).create(
            UserRoleService::class.java
        )
    }

    fun createUser(): UserService {
        return NetworkModule<UserService>(Constans.DOMAIN).create(
            UserService::class.java
        )
    }

}