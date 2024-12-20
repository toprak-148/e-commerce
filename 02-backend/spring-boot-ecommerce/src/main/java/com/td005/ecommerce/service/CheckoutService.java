package com.td005.ecommerce.service;

import com.td005.ecommerce.dto.Purchase;
import com.td005.ecommerce.dto.PurchaseResponse;



public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);

}
