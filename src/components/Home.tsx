import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, ActivityIndicator, Appbar, Text, TextInput } from 'react-native-paper'
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import fireBaseApp from "../utils/firebaseConfig"
import { RegisterScreenProps } from '../types/navigationTypes'
const Home = ({ navigation }: RegisterScreenProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const auth = getAuth(fireBaseApp)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cpassword, setCpassword] = useState("")
    const [error, setError] = useState("")
    const RegisterUser = async () => {
        setError("")
        setIsLoading(true)
        try {

            if (email && password && cpassword && password === cpassword) {
                await createUserWithEmailAndPassword(auth, email, password)
                setIsLoading(false)
                setEmail('')
                setPassword('')
                navigation.navigate("Login")
            } else {
                setError("please provide all the fields")
                setIsLoading(false)
            }
        } catch (err: any) {
            console.log(err)
            setError(err.message)
            setIsLoading(false)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text variant='bodyLarge' >Register</Text>
            <TextInput value={email}
                onChangeText={(text) => setEmail(text)}
                style={{ width: "85%" }} mode='flat' label='Email' />
            <TextInput
                value={password}
                onChangeText={(t) => setPassword(t)}
                style={{ width: "85%" }} mode='flat' label='Password' />
            <TextInput
                value={cpassword}
                onChangeText={(t) => setCpassword(t)}

                style={{ width: "85%" }} mode='flat' label='confirm Password' />
            {isLoading ?
                <ActivityIndicator />
                : (
                    <TouchableOpacity onPress={RegisterUser}>
                        <Button mode='contained-tonal'  >
                            <Text>Register</Text>
                        </Button>
                    </TouchableOpacity>
                )}
            <Text>{error}</Text>
            <View style={{ flexDirection: "row" }}>

                <Text>Login from </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")} >
                    <Text style={{ color: "blue" }} >Here</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >

    )
}
const styles = StyleSheet.create({
    container: {

        backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        gap: 10
    }
})
export default Home