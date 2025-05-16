import { useState } from "react";
import {
    HomeIcon,
    ChatBubbleBottomCenterTextIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/solid";
const tabs = [
    {
        label: "App",
        icon: <HomeIcon className="h-5 w-5 -mt-1 mr-2" />,
        value: "app",
    },
    {
        label: "Edit",
        icon: <ChatBubbleBottomCenterTextIcon className="h-5 w-5 -mt-0.5 mr-2" />,
        value: "message",
    },
    {
        label: "Settings",
        icon: <Cog6ToothIcon className="h-5 w-5 -mt-1 mr-2" />,
        value: "settings",
    },
];

export default function TabSwitcher() {
    const [active, setActive] = useState("app");

    const activeIndex = tabs.findIndex((tab) => tab.value === active);

    return (
        <div className="w-96 pl-18">
            <div className="overflow-hidden block">
                <nav>
                    <ul
                        role="tablist"
                        className="flex relative bg-gray-100 bg-opacity-60 rounded-lg p-1 flex-row"
                    >
                        {/* Animated background */}
                        <span
                            className="absolute z-10 h-full bg-white rounded-md shadow transition-all duration-300 ease-in-out"
                            style={{
                                width: `${100 / tabs.length}%`,
                                height: `${250 / tabs.length}%`,
                                left: `${(100 / tabs.length) * activeIndex}%`,
                            }}
                        ></span>

                        {/* Tab items */}
                        {tabs.map((tab) => (
                            <li
                                key={tab.value}
                                role="tab"
                                className="flex items-center justify-center text-center w-full h-full relative bg-transparent py-1 px-2 text-blue-gray-900 antialiased font-sans text-base font-normal leading-relaxed select-none cursor-pointer z-20"
                                onClick={() => setActive(tab.value)}
                            >
                                <div className="text-inherit flex items-center">
                                    {tab.icon}
                                    {tab.label}
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
