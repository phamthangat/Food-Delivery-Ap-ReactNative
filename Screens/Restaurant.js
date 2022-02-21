import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Alert } from "react-native";
import { borderBottomColor, color } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Restaurant({ route, navigation }) {

    const ScrollX = new Animated.Value(0);

    const [restaurant, setRestaurant] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [orderItems, setOrderItems] = useState([]);


    useEffect(() => {
        let { item, currentLocation } = route.params;
        setRestaurant(item);
        setCurrentLocation(currentLocation)
    })

    function editOrder(action, menuId, price) {
        let orderList = orderItems.slice();
        // console.log(orderList,"orderList1");
        let item = orderList.filter(a => a.menuId == menuId);

        if (action == "+") {
            if (item.length > 0) {
                let newQty = item[0].qty + 1;
                item[0].qty = newQty;
                item[0].total = item[0].qty * price
            } else {
                const newItem = {
                    menuId: menuId,
                    qty: 1,
                    price: price,
                    total: price
                }
                orderList.push(newItem)
            }
            setOrderItems(orderList)
        } else {
            if (item.length > 0) {
                if (item[0].qty > 0) {
                    let newQty = item[0].qty - 1;
                    item[0].qty = newQty;
                    item[0].total = item[0].qty * price
                }
            }
            setOrderItems(orderList)
        }
        addToCart(orderList);

    }

    function getOrderQty(menuId) {
        let orderItem = orderItems.filter(a => a.menuId == menuId)
        if (orderItem.length > 0) {
            return orderItem[0].qty
        }
        return 0;
    }

    function getBasketItemCount() {
        let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0);
        return itemCount;
    }

    function sumOrder() {
        let total = orderItems.reduce((a, b) => a + (b.total || 0), 0);
        return total.toFixed(2);
    }

    function renderHeader() {
        return (
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingLeft: 20,
                        justifyContent: "center"
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={{
                            width: 20,
                            height: 30
                        }}
                    >
                    </Image>
                </TouchableOpacity>

                {/* restaurant name section */}

                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <View
                        style={{
                            height: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingHorizontal: 30,
                            borderRadius: 30,
                            backgroundColor: "#EFEFF1"
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>
                            {restaurant?.name}
                        </Text>
                    </View>

                </View>
                <TouchableOpacity
                    style={{
                        width: 50,
                        marginRight: -10,
                        justifyContent: "center"
                    }}
                >
                    <Image
                        source={icons.list}
                        resizeMode="contain"
                        style={{
                            width: 20,
                            height: 30
                        }}
                    >

                    </Image>

                </TouchableOpacity>
            </View>
        )
    }

    function renderFoodInfo() {
        return (
            <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEventThrottle={15}
                showsHorizontalScrollIndicator={false}
                //onscroll
                onScroll={Animated.event([
                    { nativeEvent: { contentOffset: { x: ScrollX } } }
                ], { useNativeDriver: false })}
            >
                {
                    restaurant?.menu.map((item, index) => (
                        <View
                            key={`menu-${index}`}
                            style={{ alignItems: "center" }}
                        >
                            <View style={{ height: SIZES.height * 0.35 }}>
                                {/* {image food} */}
                                <Image
                                    source={item.photo}
                                    resizeMode="cover"
                                    style={{
                                        width: SIZES.width,
                                        height: "100%"
                                    }}
                                />
                                {/* {quantity} */}
                                <View
                                    style={{
                                        position: "absolute",
                                        bottom: -20,
                                        width: SIZES.width,
                                        height: 50,
                                        justifyContent: "center",
                                        flexDirection: "row"
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderTopLeftRadius: 25,
                                            borderBottomLeftRadius: 25
                                        }}
                                        onPress={() => editOrder("-", item.menuId, item.price)}
                                    >
                                        <Text style={{ fontSize: 30 }}>-</Text>

                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Text style={{ fontSize: 20 }}>{getOrderQty(item.menuId)}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderTopRightRadius: 25,
                                            borderBottomRightRadius: 25
                                        }}
                                        onPress={() => editOrder("+", item.menuId, item.price)}
                                    >
                                        <Text style={{ fontSize: 30 }}>+</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                            {/* name&& description */}

                            <View
                                style={{
                                    width: SIZES.width,
                                    alignItems: "center",
                                    marginTop: 15,
                                    paddingHorizontal: 20
                                }}
                            >
                                <Text
                                    style={{
                                        marginVertical: 10,
                                        textAlign: "center",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {item.name}
                                </Text>
                                <Text>{item.description}</Text>
                            </View>

                            {/* calories */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    marginTop: 10
                                }}
                            >
                                <Image
                                    source={icons.fire}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        marginRight: 10
                                    }}
                                />
                                <Text style={{
                                    color: COLORS.darkgray,
                                    lineHeight: 25
                                }} >
                                    {item.calories.toFixed(2)} cal
                                </Text>
                            </View>
                        </View>


                    ))
                }

            </Animated.ScrollView >
        )
    }

    function renderDots() {
        const dotPosition = Animated.divide(ScrollX, SIZES.width);

        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 20
                }}
            >
                {
                    restaurant?.menu.map((item, index) => {
                        const opacity = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: "clamp"
                        })

                        const dotSize = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
                            extrapolate: "clamp"
                        })

                        const dotColor = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
                            extrapolate: "clamp"
                        })
                        return (
                            <Animated.View
                                key={`dot-${index}`}
                                opacity={opacity}
                                style={{
                                    borderRadius: 30,
                                    marginHorizontal: 6,
                                    width: dotSize,
                                    height: dotSize,
                                    backgroundColor: dotColor
                                }}
                            >

                            </Animated.View>
                        )
                    })
                }

            </View>
        )
    }
    function addToCart(orderList) {
        console.log(orderList, "orderList");
        // Alert.alert("Order success!!")
        if (AsyncStorage.getItem("cart") === null) {
            console.log("no in storage");
            const cart = orderList;
            AsyncStorage.setItem("cart", JSON.stringify(cart))
        } else {
            console.log("in storage");
            const cart = orderList;
            AsyncStorage.setItem("cart", JSON.stringify(cart))
        }
    }

    function renderOrder() {
        return (
            <View>
                {
                    renderDots()
                }
                <View
                    style={{
                        backgroundColor: COLORS.white,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 20,
                            paddingHorizontal: 30,
                            borderBottomColor: COLORS.lightGray2,
                            borderBottomWidth: 1
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>{getBasketItemCount()}</Text>
                        <Text style={{ fontWeight: "bold" }}>${sumOrder()}</Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: 20,
                            paddingHorizontal: 30
                        }}>
                        <View style={{ flexDirection: "row" }}>
                            <Image
                                source={icons.pin}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: COLORS.darkgray
                                }}
                            />
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    marginLeft: 10
                                }}
                            >
                                Location
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <Image
                                source={icons.master_card}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: COLORS.darkgray
                                }}
                            />
                            <Text style={{ fontWeight: "bold", marginLeft: 10 }}>12345678</Text>
                        </View>

                    </View>

                    {/* order button */}

                    <View
                        style={{
                            padding: 20,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: SIZES.width * 0.9,
                                padding: 10,
                                backgroundColor: COLORS.primary,
                                alignItems: "center",
                                borderRadius: 30
                            }}
                            onPress={() => addToCart()}
                        >
                            <Text
                                style={{
                                    color: COLORS.white,
                                    fontSize: 22,
                                    fontWeight: "bold"

                                }}
                            >
                                Order
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderFoodInfo()}
            {renderOrder()}
        </SafeAreaView>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F6F7"
    }
})