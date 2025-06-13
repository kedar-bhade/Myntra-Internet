using MyntraBackend.Models;

namespace MyntraBackend.Data;

public static class SeedData
{
    public static List<Category> Categories { get; } = new()
    {
        new Category { Id = 1, Name = "Men" },
        new Category { Id = 2, Name = "Women" },
        new Category { Id = 3, Name = "Kids" }
    };

    public static List<Product> Products { get; } = new()
    {
        new Product { Id = 1, Name = "T-Shirt", Price = 499, ImageUrl = "https://source.unsplash.com/featured/300x400?tshirt", CategoryId = 1 },
        new Product { Id = 2, Name = "Jeans", Price = 999, ImageUrl = "https://source.unsplash.com/featured/300x400?jeans", CategoryId = 1 },
        new Product { Id = 3, Name = "Dress", Price = 1299, ImageUrl = "https://source.unsplash.com/featured/300x400?dress", CategoryId = 2 },
        new Product { Id = 4, Name = "Skirt", Price = 799, ImageUrl = "https://source.unsplash.com/featured/300x400?skirt", CategoryId = 2 },
        new Product { Id = 5, Name = "Shorts", Price = 399, ImageUrl = "https://source.unsplash.com/featured/300x400?shorts", CategoryId = 3 }
    };

    public static IEnumerable<Product> GetProductsByCategory(int categoryId)
    {
        return Products.Where(p => p.CategoryId == categoryId);
    }
}
