import { StyleSheet, Text, View, TouchableHighlight, Platform, ScrollView, TextInput, ToastAndroid } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { styleConstants } from '../../services/Constants'
import { contextData } from '../../context/DataContext'
import SplashScreen from './SplashScreen'
import { REACT_APP_API_URL } from '@env'
import { api } from '../../services/Axios'

const brokerInitial = {
    bfirstName: "",
    blastName: "",
    bemail: "",
    bphone: "",
    baddress: "",
    breraID: "",
    bcompanyName: "",
    bcompanyEmail: "",
    bcompanyPhone: "",
    bcompanyAddress: "",
    executiveFirstName: "",
    executiveLastName: "",
    executivePhone: "",
    executiveEmail: "",
}

const initialBrokerError = {
    bfirstName: "",
    blastName: "",
    bemail: "",
    bphone: "",
    breraID: "",
    bcompanyEmail: "",
    bcompanyPhone: "",
    executiveEmail: "",
    executivePhone: "",
}

const AddBrokerSource = ({navigation}) => {

    const { brokerSourcesCallback } = useContext(contextData);
    const [loading, setLoading] = useState(false);
    const [brokerCredentials, setBrokerCredentials] = useState(brokerInitial);
    const [brokerError, setBrokerError] = useState(initialBrokerError);

    const handleSave = () => {
        setLoading(true);
        if (validateBrokerForm()) {
            api.post(`${process.env.REACT_APP_API_URL}/add_broker_source`, brokerCredentials)
                .then((res) => {
                    if (res.data.message && res.data.message !== "success") {
                        ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                    } else {
                        brokerSourcesCallback(res.data);
                        setBrokerCredentials(brokerInitial);
                        setBrokerError(initialBrokerError);
                        navigation.navigate('Add Lead');
                        ToastAndroid.show('Broker source added successfully!', ToastAndroid.SHORT);
                    }
                })
                .catch((err) => {
                    // console.log(err);
                    ToastAndroid.show('Something went wrong, please try again later!', ToastAndroid.SHORT);
                })
                .finally(() => {
                    setLoading(false);
                })
        } else {
            setLoading(false);
        }
    }

    const handleReset = () => {
        setBrokerCredentials(brokerInitial);
        setBrokerError(initialBrokerError);
    }

    const validateBrokerForm = () => {
        let flag = false;
        if (brokerCredentials.bfirstName === "") {
            setBrokerError((prev) => ({ ...prev, bfirstName: "First Name is required" }));
            flag = true;
        }
        if (brokerCredentials.blastName === "") {
            setBrokerError((prev) => ({ ...prev, blastName: "Last Name is required" }));
            flag = true;
        }
        if (/\s/.test(brokerCredentials.blastName)) {
            setBrokerError((prev) => ({ ...prev, blastName: "Last Name cannot contain spaces" }));
            flag = true;
        }
        if (brokerCredentials.bemail && !(/^\w+([\.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(brokerCredentials.bemail))) {
            setBrokerError((prev) => ({ ...prev, bemail: "Please enter a valid email address" }));
            flag = true;
        }
        if (brokerCredentials.bphone.match(/^[0-9]{10}$/) === null) {
            setBrokerError((prev) => ({ ...prev, bphone: "Please enter a valid 10 digit phone number" }));
            flag = true;
        }
        if (brokerCredentials.bphone === "") {
            setBrokerError((prev) => ({ ...prev, bphone: "Phone Number is required" }));
            flag = true;
        }
        if (brokerCredentials.breraID && (brokerCredentials.breraID.match(/^[0-9a-zA-Z]+$/) === null)) {
            setBrokerError((prev) => ({ ...prev, breraID: "Please enter a valid (alphanumeric) RERA ID" }));
            flag = true;
        }
        if (brokerCredentials.bcompanyEmail && !(/^\w+([\.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(brokerCredentials.bcompanyEmail))) {
            setBrokerError((prev) => ({ ...prev, bcompanyEmail: "Please enter a valid email address" }));
            flag = true;
        }
        if (brokerCredentials.bcompanyPhone && (brokerCredentials.bcompanyPhone.match(/^[0][1-9]\d{9}$/) === null && brokerCredentials.bcompanyPhone.match(/^[1-9]\d{9}$/) === null)) {
            setBrokerError((prev) => ({ ...prev, bcompanyPhone: "Please enter a valid phone number" }));
            flag = true;
        }
        if (brokerCredentials.executiveEmail && !(/^\w+([\.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(brokerCredentials.executiveEmail))) {
            setBrokerError((prev) => ({ ...prev, executiveEmail: "Please enter a valid email address" }));
            flag = true;
        }
        if (brokerCredentials.executivePhone && brokerCredentials.executivePhone.match(/^[0-9]{10}$/) === null) {
            setBrokerError((prev) => ({ ...prev, executivePhone: "Please enter a valid 10 digits phone number" }));
            flag = true;
        }
        if (flag) {
            return false;
        } else {
            return true;
        }
    }

    useEffect(() => {
        if (brokerCredentials.bfirstName !== "") {
            setBrokerError((prev) => ({ ...prev, bfirstName: "" }));
        }
        if (brokerCredentials.blastName !== "") {
            setBrokerError((prev) => ({ ...prev, blastName: "" }));
        }
        if (!(/\s/.test(brokerCredentials.blastName))) {
            setBrokerError((prev) => ({ ...prev, blastName: "" }));
        }
        if (!brokerCredentials.bemail || (brokerCredentials.bemail && (/^\w+([\.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(brokerCredentials.bemail)))) {
            setBrokerError((prev) => ({ ...prev, bemail: "" }));
        }
        if (brokerCredentials.bphone.match(/^[0-9]{10}$/) !== null) {
            setBrokerError((prev) => ({ ...prev, bphone: "" }));
        }
        if (brokerCredentials.bphone !== "") {
            setBrokerError((prev) => ({ ...prev, bphone: "" }));
        }
        if (!brokerCredentials.breraID || (brokerCredentials.breraID && brokerCredentials.breraID.match(/^[0-9a-zA-Z]+$/) !== null)) {
            setBrokerError((prev) => ({ ...prev, breraID: "" }));
        }
        if (!brokerCredentials.bcompanyEmail || (brokerCredentials.bcompanyEmail && (/^\w+([\.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(brokerCredentials.bcompanyEmail)))) {
            setBrokerError((prev) => ({ ...prev, bcompanyEmail: "" }));
        }
        if (!brokerCredentials.bcompanyPhone || (brokerCredentials.bcompanyPhone && (brokerCredentials.bcompanyPhone.match(/^[1-9]\d{9}$/) !== null || brokerCredentials.bcompanyPhone.match(/^[0][1-9]\d{9}$/) !== null))) {
            setBrokerError((prev) => ({ ...prev, bcompanyPhone: "" }));
        }
        if (!brokerCredentials.executiveEmail || (brokerCredentials.executiveEmail && (/^\w+([\.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(brokerCredentials.executiveEmail)))) {
            setBrokerError((prev) => ({ ...prev, executiveEmail: "" }));
        }
        if (!brokerCredentials.executivePhone || (brokerCredentials.executivePhone && brokerCredentials.executivePhone.match(/^[0-9]{10}$/) !== null)) {
            setBrokerError((prev) => ({ ...prev, executivePhone: "" }));
        }
    }, [brokerCredentials.bfirstName, brokerCredentials.blastName, brokerCredentials.bemail, brokerCredentials.bphone, brokerCredentials.breraID, brokerCredentials.bcompanyEmail, brokerCredentials.bcompanyPhone, brokerCredentials.executiveEmail, brokerCredentials.executivePhone]);

    return (
        <View>
            {loading ? <SplashScreen /> :
                <ScrollView style={styles.mainContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>First Name <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, bfirstName: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.bfirstName}
                        />
                        {brokerError.bfirstName && <View>
                            <Text style={styles.warningText}>{brokerError.bfirstName}</Text>
                        </View>}
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Last Name <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, blastName: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.blastName}
                        />
                        {brokerError.blastName && <View>
                            <Text style={styles.warningText}>{brokerError.blastName}</Text>
                        </View>}
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Email</Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            keyboardType='email-address'
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, bemail: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.bemail}
                        />
                        {brokerError.bemail && <View>
                            <Text style={styles.warningText}>{brokerError.bemail}</Text>
                        </View>}
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Phone <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            keyboardType='phone-pad'
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, bphone: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.bphone}
                        />
                        {brokerError.bphone && <View>
                            <Text style={styles.warningText}>{brokerError.bphone}</Text>
                        </View>}
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Address</Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, baddress: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.baddress}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>RERA ID</Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, breraID: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.breraID}
                        />
                        {brokerError.breraID && <View>
                            <Text style={styles.warningText}>{brokerError.breraID}</Text>
                        </View>}
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Firm Name</Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, bcompanyName: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.bcompanyName}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Firm Address</Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, bcompanyAddress: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.bcompanyAddress}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Firm Email</Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            keyboardType='email-address'
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, bcompanyEmail: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.bcompanyEmail}
                        />
                        {brokerError.bcompanyEmail && <View>
                            <Text style={styles.warningText}>{brokerError.bcompanyEmail}</Text>
                        </View>}
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Firm Phone</Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            keyboardType='phone-pad'
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, bcompanyPhone: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.bcompanyPhone}
                        />
                        {brokerError.bcompanyPhone && <View>
                            <Text style={styles.warningText}>{brokerError.bcompanyPhone}</Text>
                        </View>}
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Executive First Name</Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, bexecutiveFirstName: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.bexecutiveFirstName}
                        />
                        {brokerError.bexecutiveFirstName && <View>
                            <Text style={styles.warningText}>{brokerError.bexecutiveFirstName}</Text>
                        </View>}
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Executive Last Name</Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, bexecutiveLastName: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.bexecutiveLastName}
                        />
                        {brokerError.bexecutiveLastName && <View>
                            <Text style={styles.warningText}>{brokerError.bexecutiveLastName}</Text>
                        </View>}
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Executive Email</Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            keyboardType='email-address'
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, executiveEmail: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.executiveEmail}
                        />
                        {brokerError.executiveEmail && <View>
                            <Text style={styles.warningText}>{brokerError.executiveEmail}</Text>
                        </View>}
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowTitle}>Executive Phone</Text>
                        <TextInput
                            cursorColor={styleConstants.primaryColor}
                            keyboardType='phone-pad'
                            onChangeText={(text) => setBrokerCredentials((brokerCredentials) => ({ ...brokerCredentials, executivePhone: text }))}
                            style={styles.textInput}
                            value={brokerCredentials.executivePhone}
                        />
                        {brokerError.executivePhone && <View>
                            <Text style={styles.warningText}>{brokerError.executivePhone}</Text>
                        </View>}
                    </View>
                    <View style={[styles.buttonOuter, { marginBottom: 10, marginTop: 20 }]}>
                        <TouchableHighlight
                            onPress={() => handleReset()}
                            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                        >
                            <View style={styles.buttonContainer}>
                                <Text style={styles.buttonText}>Reset</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.buttonOuter, { marginBottom: 40 }]}>
                        <TouchableHighlight
                            onPress={() => handleSave()}
                            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                        >
                            <View style={styles.buttonContainer}>
                                <Text style={styles.buttonText}>Save</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </ScrollView>}
        </View>
    )
}

export default AddBrokerSource

const styles = StyleSheet.create({
    mainContainer: {
        padding: 20,
        backgroundColor: '#ffffff',
    },
    rowContainer: {
        marginBottom: 20,
    },
    rowTitle: {
        marginBottom: 5,
    },
    textInput: {
        width: '100%',
        height: 50,
        backgroundColor: styleConstants.screenBackgroundColor,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    buttonOuter: {
        borderRadius: 5,
        overflow: 'hidden',
        width: '100%',
        height: 50,
        backgroundColor: styleConstants.primaryColor,
        elevation: 3,
    },
    buttonContainer: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 20,
    },
    warningText: {
        color: 'red',
        fontStyle: 'italic',
    },
})