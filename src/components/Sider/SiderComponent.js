import React from 'react'
import { Layout } from 'antd';
import MenuComponent from '../Menu/MenuComponent';
import { useSelector } from "react-redux";

function SiderComponent() {
    const { Sider } = Layout;
    const { margin } = useSelector((state) => state.margin);

    return (
        // side menu including menu
        <>
            <Sider
                collapsed={!margin}
                width={240}
                style={{
                    overflow: 'auto',
                    height: '90vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
                className="sider-background"
            >
                <MenuComponent />
            </Sider>
        </>
    )
}

export default SiderComponent