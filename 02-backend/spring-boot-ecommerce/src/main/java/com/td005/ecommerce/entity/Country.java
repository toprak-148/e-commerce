package com.td005.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "country")
@Getter
@Setter
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;


    // TODO : set up one-to-many with rules
    @OneToMany(mappedBy = "country")
    @JsonIgnore //TODO : verilen alanı yok sayar bir json verisi sağlanana kadar
    private List<State> states;


}
