

# PROJECT STRUCTURE
- Add your custom exceptions to the exceptions folder and let others use it.



# COMMON SERVICES (SERVICES THAT ALREADY IMPLEMENTED THAT YOU CAN USE, DRY)
- any service you created and you think others might need put it here.

- To get a user by id, throw an exception if notfound, import `getUserById(id: string): Promise<User>` in the user service.


# Packages Used 

- There's a package called class-validator, that allows us to check if the data sent to the server is valid. we don't want to save invalid data in our database. 
check it https://www.npmjs.com/package/class-validator , it's used in our DTOs to check the validity of the data, and it's used in the service layer to check if the data is valid before saving it in the database. check an example at /invites/dto/post-invite.dto.ts. 

# GUIDELINES 

- it's convenient and best practice to document our API, check this https://docs.nestjs.com/openapi/introduction on how to document your endpoints.

- When designing your API make this guide as your reference https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#restful


