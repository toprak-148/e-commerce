package com.td005.ecommerce.dto;

import com.td005.ecommerce.entity.Address;
import com.td005.ecommerce.entity.Customer;
import com.td005.ecommerce.entity.Order;
import com.td005.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;


}
