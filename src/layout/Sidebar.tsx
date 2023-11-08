import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Divider, Layout } from 'antd';
import { StyledTextL2 } from 'components';
import { useFetchCollectionsQuery } from 'services';
import { ID, ROLE, Route } from 'types/others/api';
import routes from './routes';

const { Sider } = Layout;

interface SiderProps {
    userRole: ROLE;
}

function Sidebar({ userRole }: SiderProps) {
    const location = useLocation();
    const [links, setLinks] = useState<Route[]>([]);
    const [hoveredIdx, setHoveredIdx] = useState<ID>('');

    const { data: collections, isLoading } = useFetchCollectionsQuery()


    const handleMouseEnter = (index: ID) => {
        setHoveredIdx(index);
    };
      
    const handleMouseLeave = () => {
        setHoveredIdx('');
    };
 
    useEffect(() => {
        setLinks(routes.filter((route) => route.roles?.includes(userRole)));
    }, [userRole]);

    return (
        <StyledSider width={320}>
            <div className="container">
                <div className="image">
                    <img src="/logo.svg" alt="logo" />
                </div>
                <ul className="nav-links">
                    {collections?.map((collection, index) => (
                        <li key={index}>
                            <Divider orientation='left'>
                                <StyledTextL2>
                                    {collection.title}
                                </StyledTextL2>
                            </Divider>
                            <ul className='bg'>
                                {collection.categories.map((category, index) => (
                                    <li key={index}>
                                        <NavLink 
                                            onMouseEnter={() => handleMouseEnter(category.id)} 
                                            onMouseLeave={handleMouseLeave} 
                                            to={{ pathname: '/product', search: `?category=${category.id}`}}
                                            className={() => location.search === `?category=${category.id}` 
                                                ? "active" 
                                                : ""
                                            }
                                        >
                                            {/* {React.createElement(SOrderIcon, 
                                                {color: (
                                                    hoveredIdx === category.id || 
                                                    location.search === `?category=${category.id}`) 
                                                        ? 'white' 
                                                        : '#1b1005a6' 
                                                }                                               
                                            )} */}
                                            <span>{category.title}</span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                    <Divider />
                    {links.map((link, index) => (
                        <li key={index}>
                            <NavLink 
                                onMouseEnter={() => handleMouseEnter(index)} 
                                onMouseLeave={handleMouseLeave} 
                                className={({ isActive }) => isActive ? 'active' : ''} 
                                to={{ pathname: link.path }}
                            >
                                <span>{link.title}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </StyledSider>
    );
}

export default Sidebar;

const StyledSider = styled(Sider)`
    height: 100vh;
    background-color: #fff !important;
    border-right: 1px solid rgba(27, 16, 5, 0.06);
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.03),
        0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 2px 4px rgba(0, 0, 0, 0.02);
        
    overflow-y: auto;
    overflow-x: hidden;

    .container {
        padding: 24px;

        .image {
            display: flex;
            justify-content: center;
            margin-bottom: 1rem;
            img {
                width: 10rem;
            }
        }
        ul.bg {
            padding: .4rem;
            border-radius: 4px;
            background-color: #f7f7f7;
        }
        ul.nav-links {
            display: flex;
            flex-direction: column;

            li {
                position: relative;
                list-style: none;
                cursor: pointer;
                
                a {
                    margin-bottom: .2rem;
                    text-decoration: none;
                    display: block;
                    font-size: 16px;
                    color: var(--black-65);                   
                    border-radius: 4px;
                    padding: 8px 16px;
                    transition: all 0.1s linear;

                    &:hover, &.active {
                        background: #006C41;                        
                        color: #FFFFFF;
                    }
                }
            }
        }
    }
`;