export default {
  Base: "/api",
  Users: {
    Base: "/users",
    Get: "/all",
    Add: "/add",
    Update: "/update",
    Delete: "/delete/:id",
  },
  Recipes: {
    Base: "/recipes",
    List: "/",
    Info: "/:id",
  },
} as const;
