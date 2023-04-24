import axios from "axios";
import { useState } from "react";

const index = () => {
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    const res = await axios.get("products");
    console.log(res.data);
    setProducts(res.data.products);
  };

  interface Product {
    title: string;
    description: string;
    price: number;
    image: string;
  }

  return (
    <div className="text-4xl flex flex-col justify-center items-center w-screen h-screen bg-red-50">
      <button onClick={getProducts}>test</button>

      {products && (
        <div className="flex justify-center gap-5  flex-wrap">
          {products.map((product: Product, index: number) => {
            return (
              <div key={index} className="card bg-white w-[10rem] text-sm">
                <img src={product.image}></img>
                <div>{product.title}</div>
                <div>{product.description}</div>
                <div>{product.price}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default index;
