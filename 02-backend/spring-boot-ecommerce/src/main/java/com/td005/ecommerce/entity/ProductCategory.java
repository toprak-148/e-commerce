package com.td005.ecommerce.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Entity
@Table(name = "product_category")
@Data //lombok
@Getter
@Setter
public class ProductCategory {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_name")
    private String categoryName;


    @OneToMany(cascade = CascadeType.ALL , mappedBy = "category")
    private Set<Product> products;

}

