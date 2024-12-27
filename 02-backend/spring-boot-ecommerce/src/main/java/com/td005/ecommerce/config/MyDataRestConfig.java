package com.td005.ecommerce.config;

import com.td005.ecommerce.entity.Country;
import com.td005.ecommerce.entity.Product;
import com.td005.ecommerce.entity.ProductCategory;
import com.td005.ecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager)
    {
        this.entityManager = entityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE};


        //disabled HTTP methods for product : PUT,POST and DELETE


        disableHttpMethods(Product.class,config, theUnsupportedActions);
        disableHttpMethods(ProductCategory.class,config, theUnsupportedActions);
        disableHttpMethods(Country.class,config, theUnsupportedActions);
        disableHttpMethods(State.class,config, theUnsupportedActions);


        exposeIds(config);
    }

    private static void disableHttpMethods(Class theClass , RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)))
                .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)));
    }

    //call an internal helper methos
    private void exposeIds(RepositoryRestConfiguration config)
    {
        //expose entity ids
        //

        // get a list of all entity classes from the entity manager
        Set<jakarta.persistence.metamodel.EntityType<?>> entities = this.entityManager.getMetamodel().getEntities();

        // create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();

        // get the entity types for the entities
        for(EntityType<?> tempEntityType : entities)
        {
            entityClasses.add(tempEntityType.getJavaType());
        }

        //expose the entity ids for the array of etity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);

    }
}
