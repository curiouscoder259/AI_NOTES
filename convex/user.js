import { mutation, query } from "./_generated/server";
import {v} from "convex/values"
export const createUser=mutation({
  args:{
    email:v.string(),
    userName:v.string(),
    imageUrl:v.string(),
    // upgrade:v.boolean()
  },
  handler: async(ctx,args)=>{
      //if user already exit
      const user=await ctx.db.query('users')
      .filter((q)=>q.eq(q.field('email'),args.email))
      .collect();
     // if not
      if(user?.length ==0){
        await ctx.db.insert('users',{
          email:args.email,
          userName:args.userName,
          imageUrl:args.imageUrl,
          upgrade:false
        });
        return 'Inserted new User'
      }
      return 'User exist already'

  },
  
})

// export const userUpgradePlan=mutation({
//   args:{
//     userEmail:v.optional(v.string())
//   },
//   handler:async(ctx,args)=>{
//     const result=await ctx.db.query('users').filter(q=>q.eq(q.field('email'),args.userEmail)).collect()

//     if(result){
//       await ctx.db.patch(result[0]._id,{'upgrade':true})
//       return 'succes'
//     }else{
//       return 'error'
//     }
//   }

// })
export const userUpgradePlan = mutation({
  args: {
    userEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.userEmail) {
        return { status: "error", message: "Email is required" };
      }

      // Fetch the user by email
      const result = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.userEmail))
        .collect();

      // Check if the user exists
      if (result.length === 0) {
        return { status: "error", message: "User not found" };
      }

      // Perform the patch operation
      const userId = result[0]._id;
      await ctx.db.patch(userId, { upgrade: true });

      return { status: "success", message: "User upgraded successfully" };
    } catch (error) {
      // Log the error and return a user-friendly message
      console.error("Error in userUpgradePlan:", error);
      return { status: "error", message: "An unexpected error occurred", error: error.message };
    }
  },
});

export const GetUserInfo=query({
  args:{
    userEmail:v.optional(v.string())

  },
  handler:async(ctx,args)=>{
     if(!args.userEmail){
      return ;
     }
    const result = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.userEmail))
        .collect();
        return result[0];
  }
})
