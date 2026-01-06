import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Item {
  id: string;
  title: string;
  price: number;
  image_url?: string | null;
}

export default function Marketplace() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setItems(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return <p className="p-6">Loading items...</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.length === 0 ? (
        <p>No items listed yet</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded hover:shadow transition"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-gray-600">₹{item.price}</p>
          </div>
        ))
      )}
    </div>
  );
}
