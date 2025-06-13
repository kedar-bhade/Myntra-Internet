using MyntraBackend.Models;

namespace MyntraBackend.Data;

public static class Cart
{
    public static List<CartItem> Items { get; } = new();
}
