import * as React from 'react';
import { Text, View, Button, TouchableOpacity, Image, SafeAreaView, StyleSheet } from 'react-native';
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Cart({ navigation, route }) {
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
            </View>
        )
    }
    // const getMyStringValue = async () => {
    //     const value = await AsyncStorage.getItem('cart')
    //     console.log('Done.', JSON.parse(value))
    // }
    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Cart</Text>
                {/* {getMyStringValue()} */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F6F7"
    }
})