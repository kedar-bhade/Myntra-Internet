using MyntraBackend.Models;

namespace MyntraBackend.Data;

public static class OrderStore
{
    public static List<Order> Orders { get; } = new();
    private static int _nextId = 1;

    public static Order AddOrder(IEnumerable<CartItem> items, IEnumerable<Product> products)
    {
        var order = new Order
        {
            Id = _nextId++,
            Items = items.Select(i => new CartItem { ProductId = i.ProductId, Quantity = i.Quantity }).ToList()
        };

        order.TotalPrice = order.Items.Sum(i =>
        {
            var product = products.FirstOrDefault(p => p.Id == i.ProductId);
            return product is null ? 0 : product.Price * i.Quantity;
        });

        Orders.Add(order);
        return order;
    }
}
