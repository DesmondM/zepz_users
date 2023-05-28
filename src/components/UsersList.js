import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GroupAdd from '@mui/icons-material/GroupAdd';
import BlockRounded from '@mui/icons-material/BlockRounded';
import AddCircle from '@mui/icons-material/AddCircle';
import Block from '@mui/icons-material/Block';
import RemoveCircle from '@mui/icons-material/RemoveCircle';
import { GroupRemove } from '@mui/icons-material';

const appStyles = {
    container: {
        padding: '20px', width: '70%', margin: 'auto', border: '1px solid lightgrey'
    },
    icon: {
        position: 'absolute',
        top: ' 0',
        right: '0',
        transform: 'translate(50%, -50%)',
    },
    iconsTextContainer: {
        display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 'auto'
    },
    contents: {
        display: 'flex',
        gap: '10px',
        padding: '10px',
        width: '80%',
        flexWrap: 'wrap',
        margin: 'auto',
        marginBottom: '70px',
        justifyContent: 'flex-start',
    },
    followed: {
        cursor: 'pointer',
        border: '1px solid #0382e9',
        borderRadius: '3px',
    },
    unfollow: {
        color: '#0382e9',
        width: '30px'
    },
    block: {
        color: '#ff451c', width: '30px'
    },
    users: {
        display: 'flex',
        gap: '10px',
        flexDirection: 'column',
        padding: '20px',
        width: '150px',
        border: 'none',
        borderRadius: '5px',
    },
    expandedSettings: {
        display: 'flex', gap: '10px', flexDirection: 'column', marginTop: '10px'
    },
    moreSettings: {
        border: '1px solid black', padding: '6px', cursor: 'pointer', borderRadius: '6px'
    }
};

const UsersList = () => {
    const [usersList, setUsersList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [errorState, setErrorState] = useState(false);
    const [expand, setExpand] = useState([]);
    const [blocked, setBlocked] = useState([]);
    const [followed, setFollowed] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchList();
    }, []);

    useEffect(() => {
        const filtered = usersList.filter(user =>
            user.display_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, usersList]);

    useEffect(() => {
        localStorage.setItem('blocked', JSON.stringify(blocked));
        localStorage.setItem('followed', JSON.stringify(followed));
    }, [blocked, followed]);

    useEffect(() => {
        const storedBlocked = localStorage.getItem('blocked');
        const storedFollowed = localStorage.getItem('followed');

        if (storedBlocked) {
            setBlocked(JSON.parse(storedBlocked));
        } else {
            setBlocked(Array(usersList.length).fill(false));
        }

        if (storedFollowed) {
            setFollowed(JSON.parse(storedFollowed));
        } else {
            setFollowed(Array(usersList.length).fill(false));
        }
    }, []);

    const fetchList = async () => {
        try {
            const response = await axios.get(
                'http://api.stackexchange.com/2.2/users?pagesize=20&order=desc&sort=reputation&site=stackoverflow'
            );
            setUsersList(response.data.items);
            setFilteredUsers(response.data.items);
            setExpand(Array(response.data.items.length).fill(false));
        } catch (error) {
            setErrorState(true);
        }
    };

    const handleExpand = (index) => {
        const updatedExpand = [...expand];
        updatedExpand[index] = !updatedExpand[index];
        setExpand(updatedExpand);
    };

    const handleBlockUser = (index) => {
        const updatedBlocked = [...blocked];
        updatedBlocked[index] = !updatedBlocked[index];
        setBlocked(updatedBlocked);
    };

    const handleFollowUser = (index) => {
        const updatedFollowed = [...followed];
        updatedFollowed[index] = !updatedFollowed[index];
        setFollowed(updatedFollowed);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };


    return (
        <div style={appStyles.container}>
            <div>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'column',
                    padding: '20px',
                    margin: 'auto',
                    width: '20%',
                    justifyContent: 'left',
                    border: 'none',
                    borderRadius: '5px',
                }}>
                    <input
                        type="text"
                        title='Search Name'
                        style={{ padding: '10px' }}
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Filter by name"
                    />
                </div>
                <div
                    style={appStyles.contents}
                >
                    {errorState ? (
                        <div style={{ margin: 'auto' }}><div>Error getting data
                            <div>
                                <img
                                    alt="Image"
                                    width={120}
                                    style={{ borderRadius: '50%' }}
                                />
                            </div>

                            <div>
                                <b>Name: </b>
                                {''}
                            </div>
                            <div>
                                <b>Reputation: </b>
                                {''}
                            </div>
                        </div></div>
                    ) : (
                        <>

                            {filteredUsers.map((user, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...appStyles.users,
                                        background: blocked[index] ? '#d9d8d6' : '#f1faee',
                                        color: blocked[index] ? '#979795' : '',
                                    }}
                                >
                                    <div>
                                        <img
                                            src={user.profile_image}
                                            alt="Image"
                                            width={120}
                                            style={{ borderRadius: '50%' }}
                                        />
                                        <GroupAdd style={appStyles.icon} />
                                    </div>

                                    <div>
                                        <b>Name: </b>
                                        {user.display_name}
                                    </div>
                                    {followed[index] && (
                                        <div
                                            style={appStyles.followed}
                                            onClick={() => handleFollowUser(index)}
                                        >
                                            <div style={appStyles.iconsTextContainer}>
                                                <span style={{ margin: '5px 0 0 30px' }}><GroupRemove style={appStyles.unfollow} /></span>
                                                <span style={{ marginTop: '1px' }}> Unfollow</span>
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <b>Reputation: </b>
                                        {user.reputation}
                                    </div>
                                    {blocked[index] && <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}><Block style={{ color: 'red', width: '150px', height: '50px' }} /><div>This user is blocked</div></div>}

                                    <div>
                                        {blocked[index] ? null : (
                                            <div style={appStyles.moreSettings}>
                                                <div onClick={() => handleExpand(index)}>
                                                    {expand[index] ? (
                                                        <>



                                                            <div style={appStyles.iconsTextContainer}>
                                                                <span style={{ margin: '5px 0 0 30px' }}> <RemoveCircle /></span>
                                                                <span style={{ marginTop: '1px' }}> Close</span>
                                                            </div>

                                                        </>
                                                    ) : (
                                                        <div style={appStyles.iconsTextContainer}>
                                                            <span><AddCircle /></span>
                                                            <span>Additional Options</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {expand[index] && (
                                                    <div style={appStyles.expandedSettings}>
                                                        <div>
                                                            <div
                                                                style={appStyles.followed}
                                                                onClick={() => handleFollowUser(index)}
                                                            >
                                                                <div style={appStyles.iconsTextContainer}>
                                                                    <span style={{ margin: '5px 0 0 30px' }}><GroupAdd style={appStyles.unfollow} /></span>
                                                                    <span style={{ marginTop: '1px' }}> Follow</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div
                                                                style={appStyles.followed}
                                                                onClick={() => handleBlockUser(index)}
                                                            >
                                                                <div style={appStyles.iconsTextContainer}>
                                                                    <span style={{ margin: '5px 0 0 30px' }}> <BlockRounded style={appStyles.block} /></span>
                                                                    <span style={{ marginTop: '1px' }}> Block</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersList;
