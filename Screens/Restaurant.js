import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from "react-native";
import { color } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { icons, images, SIZES, COLORS, FONTS } from '../constants';

export default function Restaurant({ route, navigation }) {

    const ScrollX = new Animated.Value(0);

    const [restaurant, setRestaurant] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        let { item, currentLocation } = route.params;
        setRestaurant(item);
        setCurrentLocation(currentLocation)
    })
    function renderHeader() {
        return (
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    style={{
                        width: 30,
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
                        width: 30,
                        paddingRight: 20,
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
                                        <Text style={{ fontSize: 20 }}>5</Text>
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

    function renderOrder() {
        return (
            <View>
                {
                    renderDots()
                }
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