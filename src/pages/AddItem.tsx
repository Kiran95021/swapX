import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddItem() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please sign in first");
      setLoading(false);
      return;
    }

    let imageUrl: string | null = null;

    if (image) {
      const fileName = `${user.id}-${Date.now()}`;

      const { error: uploadError } = await supabase.storage
        .from("item-images")
        .upload(fileName, image);

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("item-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("items").insert({
      title,
      price,
      image_url: imageUrl,
      user_id: user.id,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Item listed successfully");
      setTitle("");
      setPrice("");
      setImage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">List an Item</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Item title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        className="w-full border p-2 rounded"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <button
        className="w-full bg-purple-600 text-white py-2 rounded"
        disabled={loading}
      >
        {loading ? "Listing..." : "List Item"}
      </button>
    </form>
  );
}
