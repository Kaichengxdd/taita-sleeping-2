import Clicker from "./Clicker";
import Achievements from "./Achievements";
import { useState } from "react";
import "../index.css";

const Navbar = () => {
    const [display, setDisplay] = useState("clicker");

    return (
        <div>
            <div className="flex flex-col justify-center align-baseline gap-2 max-w-1/2 absolute top-0 p-5 left-0 z-10">
                <button 
                    className="text-textprimary text-xl w-auto border-2 border-border rounded p-2 hover:bg-gray-800 hover:cursor-pointer"
                    onClick={() => setDisplay("clicker")}
                >
                        Clicker
                </button>
                <button 
                    className="text-textprimary text-xl w-auto border-2 border-border rounded p-2 hover:bg-gray-800 hover:cursor-pointer"
                    onClick={() => setDisplay("achievements")}
                >
                        Achievements
                </button>
            </div>
            <div>
                {display === "clicker" && (
                    <div className="fade-in z-0">
                        <Clicker />
                    </div>
                )}
                {display === "achievements" && (
                    <div className="fade-in z-0">
                        <Achievements />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar;