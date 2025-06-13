using MyntraBackend.Data;
using MyntraBackend.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.MapGet("/api/products", () => SeedData.Products);

app.MapGet("/api/products/{id:int}", (int id) =>
{
    var product = SeedData.Products.FirstOrDefault(p => p.Id == id);
    return product is not null ? Results.Ok(product) : Results.NotFound();
});

app.MapGet("/api/categories", () => SeedData.Categories);

app.MapGet("/api/categories/{id:int}/products", (int id) =>
{
    var category = SeedData.Categories.FirstOrDefault(c => c.Id == id);
    if (category is null) return Results.NotFound();
    var products = SeedData.GetProductsByCategory(id);
    return Results.Ok(products);
});

app.MapGet("/api/cart", () => Cart.Items);

app.MapGet("/api/products/search", (string q) =>
{
    var query = q.ToLower();
    var results = SeedData.Products
        .Where(p => p.Name.ToLower().Contains(query));
    return Results.Ok(results);
});

app.MapPost("/api/cart/{productId:int}", (int productId) =>
{
    var item = Cart.Items.FirstOrDefault(c => c.ProductId == productId);
    if (item is null)
    {
        Cart.Items.Add(new CartItem { ProductId = productId, Quantity = 1 });
    }
    else
    {
        item.Quantity++;
    }
    return Results.Ok(Cart.Items);
});

app.MapDelete("/api/cart/{productId:int}", (int productId) =>
{
    var item = Cart.Items.FirstOrDefault(c => c.ProductId == productId);
    if (item is null) return Results.NotFound();
    Cart.Items.Remove(item);
    return Results.Ok(Cart.Items);
});

app.MapGet("/api/orders", () => OrderStore.Orders);

app.MapPost("/api/orders", () =>
{
    if (!Cart.Items.Any()) return Results.BadRequest("Cart is empty");
    var order = OrderStore.AddOrder(Cart.Items, SeedData.Products);
    Cart.Items.Clear();
    return Results.Ok(order);
});

app.Run();
