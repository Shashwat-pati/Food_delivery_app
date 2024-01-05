import React, { useState, useRef, useEffect } from "react";
import { useDispatchCart, useCart } from "./contextReducer";
import { useNavigate } from "react-router-dom";
import "./body.css";

export default function Body(props) {
    const dispatch = useDispatchCart();
    const [qty, setQty] = useState(1);
    const [size, setSize] = useState("");

    const data = useCart();
    let navigate = useNavigate();
    const priceRef = useRef();
    const options = props.options;
    const priceOptions = Object.keys(options);
    const foodItem = props.foodItems;

    const handleClick = () => {
        if (
            !localStorage.getItem("authToken") &&
            !localStorage.getItem("sessionId")
        ) {
            navigate("/login");
        }
    };

    const handleQty = (e) => {
        setQty(e.target.value);
    };

    const handleOptions = (e) => {
        setSize(e.target.value);
    };

    const handleAddToCart = async () => {
        if (
            !localStorage.getItem("authToken") &&
            !localStorage.getItem("sessionId")
        ) {
            navigate("/login");
        } else {
            let food = [];
            for (const item of data) {
                if (item.id === foodItem._id && item.size === size) {
                    food = item;

                    break;
                }
            }

            if (food !== []) {
                if (food.size === size) {
                    await dispatch({
                        type: "UPDATE",
                        id: foodItem._id,
                        size: size,
                        price: finalPrice,
                        qty: qty,
                    });
                    console.log(food);
                    return;
                } else if (food.size !== size) {
                    await dispatch({
                        type: "ADD",
                        id: foodItem._id,
                        name: foodItem.name,
                        price: finalPrice,
                        qty: qty,
                        size: size,
                    });

                    return;
                }
                return;
            }

            await dispatch({
                type: "ADD",
                id: foodItem._id,
                name: foodItem.name,
                price: finalPrice,
                qty: qty,
                size: size,
            });
        }
    };

    const finalPrice = qty * parseInt(options[size]);

    useEffect(() => {
        setSize(priceRef.current.value);
    }, []);

    return (
        <div>
            <div
                className="card mt-3 border-black hover-div"
                style={{ width: "100%" }}
            >
                <img src={foodItem.img} className="card-img-top" alt="..." />
                <div className="card-body">
                    <div className="d-inline h-100 fs-5">
                        <h5 className="card-title">{foodItem.name} </h5>₹
                        {finalPrice}/-
                    </div>

                    <div className="container w-100">
                        <select
                            className="h-100  rounded "
                            onClick={handleClick}
                            onChange={handleQty}
                            style={{ backgroundColor: "#a6e30e" }}
                        >
                            {Array.from(Array(6), (e, i) => {
                                return (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                );
                            })}
                        </select>
                        <select
                            className="m-3 h-100  rounded "
                            onClick={handleClick}
                            onChange={handleOptions}
                            ref={priceRef}
                            style={{
                                backgroundColor: "#a6e30e",
                                color: "hsl(0, 0%, 18%)",
                            }}
                        >
                            {priceOptions.map((data) => {
                                return (
                                    <option key={data} value={data}>
                                        {data}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <hr />
                    <div
                        className="btn btn-success justify-center ms-2"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </div>
                </div>
            </div>
        </div>
    );
}
