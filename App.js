import { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, Button, Switch, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
// import Login from './components/login';
const Stack = createNativeStackNavigator();

const localhost = '192.168.8.242';

function TextInTheme({ theme = false, ...props }) {
    return (
        <Text
            {...props}
            style={{
                color: theme ? '#111' : '#000',
                ...props.style,
            }}
        />
    );
}
function TextInTheme2({ theme = false, ...props }) {
    return (
        <Text
            {...props}
            style={{
                color: theme ? '#fff' : '#000',
                ...props.style,
            }}
        />
    );
}

function ProductCard({ theme, product, isFavorite = false, onFavoriteChange }) {
    const [isFavoriteState, setIsFavoriteState] = useState(isFavorite);

    useEffect(() => {
        setIsFavoriteState(isFavorite);
    }, [isFavorite]);

    function handleIsFavoriteChange() {
        setIsFavoriteState(!isFavoriteState);
        onFavoriteChange(!isFavoriteState);
    }

    return (
        <View
            style={{
                flexDirection: 'row',
                paddingVertical: 16,
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 5,
                marginBottom: 10,
            }}
        >
            <Image
                source={{ uri: product.image }}
                style={{
                    width: 110,
                    height: 100,
                    borderRadius: 16,
                }}
            />
            <View
                style={{
                    paddingLeft: 16,
                    flex: 1,
                }}
            >
                <TextInTheme
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}
                    theme={theme}
                >
                    {product.name}
                </TextInTheme>
                <Text
                    style={{
                        fontSize: 18,
                        color: 'red',
                    }}
                >
                    {product.price + ' đ'}
                </Text>
            </View>
            <TouchableOpacity
                onPress={handleIsFavoriteChange}
                style={{
                    alignSelf: 'center',
                }}
            >
                <FontAwesome size={24} color={isFavoriteState ? '#f33' : '#bbb'} name="heart" />
            </TouchableOpacity>
        </View>
    );
}

function ProductListScreen({ navigation, theme, favoriteList, setFavoriteList }) {
    const [isLoading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        fetch('http://' + localhost + ':5000/api/product')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setProducts(resJson.products);
                    console.log(products);
                } else {
                    setProducts([]);
                }
            });
    };

    useEffect(() => {
        getProducts();
    }, []);
    function handleChangeFavoriteList(id, isFavorite) {
        let newFavoriteList = [];

        if (isFavorite) {
            newFavoriteList = [...favoriteList, id];
        } else {
            newFavoriteList = favoriteList.filter((_id) => _id !== id);
        }
        setFavoriteList(newFavoriteList);

        AsyncStorage.setItem('favorites', JSON.stringify(newFavoriteList)).then((value) => {});
    }
    return (
        <ScrollView style={{ flex: 1, padding: 24, backgroundColor: theme ? '#222' : '#eee' }}>
            {products.map((product) => (
                <TouchableOpacity key={product.id} onPress={() => navigation.navigate('Detail', { product })}>
                    <ProductCard
                        theme={theme}
                        product={product}
                        isFavorite={favoriteList.includes(product.id)}
                        onFavoriteChange={(isFavorite) => handleChangeFavoriteList(product.id, isFavorite)}
                    />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}
function FavoriteProductScreen({ navigation, theme, favoriteList, setFavoriteList }) {
    const [isLoading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        fetch('http://' + localhost + ':5000/api/product')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setProducts(resJson.products);
                    console.log(products);
                } else {
                    setProducts([]);
                }
            });
    };

    useEffect(() => {
        getProducts();
    }, []);
    function handleChangeFavoriteList(id, isFavorite) {
        let newFavoriteList = [];

        if (isFavorite) {
            newFavoriteList = [...favoriteList, id];
        } else {
            newFavoriteList = favoriteList.filter((_id) => _id !== id);
        }
        setFavoriteList(newFavoriteList);

        AsyncStorage.setItem('favorites', JSON.stringify(newFavoriteList)).then((value) => {});
    }

    return (
        <ScrollView style={{ flex: 1, padding: 24, backgroundColor: theme ? '#222' : '#eee' }}>
            {products.map(
                (product) =>
                    favoriteList.includes(product.id) && (
                        <TouchableOpacity key={product.id} onPress={() => navigation.navigate('Detail', { product })}>
                            <ProductCard
                                product={product}
                                theme={theme}
                                isFavorite={favoriteList.includes(product.id)}
                                onFavoriteChange={(isFavorite) => handleChangeFavoriteList(product.id, isFavorite)}
                            />
                        </TouchableOpacity>
                    )
            )}
        </ScrollView>
    );
}

function DetailProductScreen({ route, theme, favoriteList, setFavoriteList }) {
    const product = route.params.product;
    const isFavorite = favoriteList.includes(product.id);
    function handleChangeFavoriteList() {
        let newFavoriteList = [];

        if (!isFavorite) {
            newFavoriteList = [...favoriteList, product.id];
        } else {
            newFavoriteList = favoriteList.filter((_id) => _id !== product.id);
        }
        setFavoriteList(newFavoriteList);

        AsyncStorage.setItem('favorites', JSON.stringify(newFavoriteList)).then((value) => {});
    }
    return (
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: theme ? '#222' : '#eee' }}>
            <Image
                source={{ uri: product.image }}
                style={{
                    width: '100%',
                    height: 300,
                    borderRadius: 16,
                    backgroundColor: 'white',
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <View>
                    <TextInTheme2
                        theme={theme}
                        style={{
                            fontSize: 20,
                            marginVertical: 8,
                            fontWeight: 'bold',
                        }}
                    >
                        {product.name}
                    </TextInTheme2>
                    <TextInTheme2
                        theme={theme}
                        style={{
                            fontSize: 20,
                            color: 'red',
                        }}
                    >
                        {product.price + ' đ'}
                    </TextInTheme2>
                </View>
                <TouchableOpacity onPress={handleChangeFavoriteList}>
                    <FontAwesome
                        size={30}
                        color={isFavorite ? 'red' : 'gray'}
                        name="heart"
                        style={{
                            alignSelf: 'center',
                        }}
                    />
                </TouchableOpacity>
            </View>
            <TextInTheme2 theme={theme} style={{ fontWeight: 900, marginTop: 16, marginBottom: 4 }}>
                Description:
            </TextInTheme2>
            <TextInTheme2 theme={theme}>{product.description}</TextInTheme2>
        </ScrollView>
    );
}
function SettingScreen({ navigation, route, theme, setDark }) {
    function handleChangeTheme() {
        AsyncStorage.setItem('DarkTheme', JSON.stringify(!theme)).then((value) => {});
        setDark((previousState) => !previousState);
    }

    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: theme ? '#222' : '#eee',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 8,
                }}
            >
                <TextInTheme2 style={{ marginRight: 8, fontSize: 26 }} theme={theme}>
                    Dark theme
                </TextInTheme2>
                <Switch
                    trackColor={{ false: '#767577', true: '#4285eb' }}
                    thumbColor={theme ? '#f4f3f4' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={handleChangeTheme}
                    value={theme}
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate('Login');
                }}
            >
                <Text style={styles.buttonText}>logout</Text>
            </TouchableOpacity>
        </View>
    );
}
function Login({ navigation, route, theme, setDark }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [log, setLog] = useState(false);

    const login = () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
            email: username,
            password: password,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        };

        fetch('http://' + localhost + ':5000/api/auth/login', requestOptions)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    // setLoading(false);
                    setLog(true);
                    // dispatch(accountActions.login(resJson.account));
                    // if (resJson.account?.role?.name == 'Chủ cửa hàng') navigate('/admin');
                    // else navigate('/');
                    console.log(resJson.account);
                } else {
                    // setLoading(false);
                    showErorrNoti();
                }
            })
            .catch(() => {
                setLoading(false);
                showErorrNoti();
            });
        // setBMI(weight / (height*height));
        if (username && password) {
            if (log) {
                navigation.navigate('Home');
            } else setMessage('Wrong username or password');
        } else {
            setMessage('Please enter username and password');
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Username:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => {
                    setUsername(text);
                }}
            ></TextInput>
            <Text style={styles.text}>Password:</Text>
            <TextInput
                style={styles.input}
                secureTextEntry={true}
                onChangeText={(text) => {
                    setPassword(text);
                }}
            />
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity style={styles.button} onPress={login}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const Tab = createBottomTabNavigator();

function TabBarIcon(props) {
    return <FontAwesome size={20} {...props} />;
}

function HomeTabs() {
    const [theme, setDark] = useState(false);
    const [favoriteList, setFavoriteList] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('favorites').then((value) => {
            if (value !== null) {
                setFavoriteList(JSON.parse(value));
            }
        });
        AsyncStorage.getItem('DarkTheme').then((value) => {
            if (value !== null) {
                setDark(JSON.parse(value));
            }
        });
    }, []);

    return (
        <Tab.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme ? '#111' : '#fff',
                },
                headerTitleStyle: {
                    color: theme ? '#fff' : '#000',
                },
                tabBarStyle: {
                    backgroundColor: theme ? '#111' : '#fff',
                },
            }}
        >
            <Tab.Screen
                name="List-Item"
                options={{
                    tabBarIcon: (props) => <TabBarIcon name="list-ul" {...props} />,
                }}
            >
                {(props) => (
                    <ProductListScreen
                        {...props}
                        theme={theme}
                        favoriteList={favoriteList}
                        setFavoriteList={setFavoriteList}
                    />
                )}
            </Tab.Screen>
            <Tab.Screen
                name="Favorite List"
                options={{
                    tabBarIcon: (props) => <TabBarIcon name="heart" {...props} />,
                }}
            >
                {(props) => (
                    <FavoriteProductScreen
                        {...props}
                        theme={theme}
                        favoriteList={favoriteList}
                        setFavoriteList={setFavoriteList}
                    />
                )}
            </Tab.Screen>
            <Tab.Screen
                name="Detail"
                options={{
                    tabBarButton: () => null,
                }}
            >
                {(props) => (
                    <DetailProductScreen
                        {...props}
                        theme={theme}
                        favoriteList={favoriteList}
                        setFavoriteList={setFavoriteList}
                    />
                )}
            </Tab.Screen>
            <Tab.Screen
                name="Setting"
                options={{
                    tabBarIcon: (props) => <TabBarIcon name="gear" {...props} />,
                }}
            >
                {(props) => (
                    <SettingScreen
                        {...props}
                        theme={theme}
                        setDark={setDark}
                        favoriteList={favoriteList}
                        setFavoriteList={setFavoriteList}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen
                        name="Home"
                        component={HomeTabs}
                        options={{
                            header: () => null,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
            <StatusBar />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    text: {
        justifyContent: 'flex-start',
        fontSize: 20,
        alignSelf: 'flex-start',
        padding: 10,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        width: '100%',
        padding: 10,
        height: 60,
        backgroundColor: 'grey',
        color: 'white',
        borderRadius: 4,
    },
    message: {
        alignSelf: 'center',
        padding: 25,
        fontSize: 20,
        color: 'red',
    },
    button: {
        backgroundColor: 'grey',
        width: '40%',
        height: 50,
        borderRadius: 6,
        justifyContent: 'center',
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 25,
        color: 'white',
    },
    success: {
        fontSize: 30,
        padding: 10,
        fontWeight: 'bold',
    },
});
