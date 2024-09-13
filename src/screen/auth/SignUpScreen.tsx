import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    Platform, UIManager, LayoutAnimation,
} from 'react-native';
import {Height, Width} from '../../config/global/dimensions.ts';
import Welspy from '../../hooks/Welspy.ts';
import store from '../../state/store.ts';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
if (Platform.OS === 'ios' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SignUpScreen = () => {

    const [email, setEmail] = useState("");
    const [verifyStarted, setVerifyStarted] = useState(false);
    const [emailCode, setEmailCode] = useState("");
    const [verifyEmail, setVerifyEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [test, setTest] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    const {hookQueue, queueSequence} = store.hookState(state => state)

    useEffect(() => {
        console.log(queueSequence);
        console.log(hookQueue);
        if(queueSequence[queueSequence.length-1] == "email/send?POST") {
            setVerifyStarted(true);
        } else if (queueSequence[queueSequence.length-1] == "email/check?POST") {
            if (hookQueue[hookQueue.length-1].response.data.status === 200) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setVerifyStarted(false);
                setVerifyEmail(email);
                setEmailCode("");
                setEmail("");
            } else {
                setEmailCode("");
            }
        }
        store.hookState.setState((prev) => ({hookQueue: []}))
    }, [queueSequence])

    useEffect(() => {
        if (submitting) {
          if (verifyEmail && phoneNumber && name && password) {
            scrollViewRef.current?.scrollTo({
              x: Width * 4,
              animated: true,
            });
          } else if (verifyEmail && phoneNumber && name) {
            scrollViewRef.current?.scrollTo({
              x: Width * 3,
              animated: true,
            });
          } else if (verifyEmail && phoneNumber) {
            scrollViewRef.current?.scrollTo({
              x: Width * 2,
              animated: true,
            });
          } else if (verifyEmail) {
            scrollViewRef.current?.scrollTo({
              x: Width * 1,
              animated: true,
            });
          }
        }
    }, [submitting]);

    return (
        <SafeAreaView>
            <ScrollView
                ref={scrollViewRef}
                showsHorizontalScrollIndicator={false}
                horizontal
                pagingEnabled={true}
                style={styles.container}

            >
                <View style={styles.gestureTab}>
                    <Image src={"https://i.ibb.co/7tcnc44/Logo-small-2.png"} style={styles.stickyLogo} />
                    <View style={[styles.input, {borderWidth: 0, width: "90%", justifyContent: "space-between", paddingHorizontal: 0, flexDirection: "row", overflow: 'hidden'}]}>
                        <TextInput
                            style={[styles.input,{width: email? "70%" : "100%", height: "100%", marginTop: 0}]}
                            placeholder="이메일을 입력해주세요"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={(event) => {
                                if(!event) {
                                    setVerifyStarted(false);
                                }
                                setEmail(event);
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            }}
                            onSubmitEditing={(event) => Welspy.auth.emailSend(event.nativeEvent.text)}
                        />
                        <TouchableOpacity style={[styles.verifyButton, {width: email? "27%" : "0%", paddingHorizontal: email? "0%" : "0%", marginLeft: email? "-31%" : "0%"}]} onPress={() => {
                            if(email.includes("@") && email.split("@")[1].includes(".")) {
                                Welspy.auth.emailSend(email)
                            }
                        }}>
                            <Text style={styles.ButtonText}>전송</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.input, {borderWidth: 0, width: "90%", justifyContent: "space-between", paddingHorizontal: 0, flexDirection: "row", overflow: 'hidden', marginTop: "5%", height: verifyStarted? "9.5%" : "0%"}]}>
                        <TextInput
                            style={[styles.input,{width: emailCode? "70%" : "100%", height: "100%", marginTop: 0}]}
                            placeholder="인정번호를 입력해주세요"
                            keyboardType={"numeric"}
                            value={emailCode}
                            autoCapitalize="none"
                            onChangeText={(event) => {
                                setEmailCode(event);
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            }}
                            onSubmitEditing={event => {
                                Welspy.auth.emailCheck(email, event.nativeEvent.text)
                            }}
                        />
                        <TouchableOpacity style={[styles.verifyButton, {width: emailCode? "27%" : "0%", paddingHorizontal: emailCode? "0%" : "0%", marginLeft: emailCode? "-31%" : "0%"}]} onPress={() => {
                            setSubmitting(true);
                            Welspy.auth.emailCheck(email, emailCode)
                        }}>
                            <Text style={styles.ButtonText}>인증</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                { verifyEmail &&
                  <View style={styles.gestureTab}>
                    <Image src={"https://i.ibb.co/7tcnc44/Logo-small-2.png"} style={styles.stickyLogo} />
                    <TextInput
                      style={styles.input}
                      placeholder="전화번호를 입력해주세요"
                      autoCapitalize="none"
                      onEndEditing={(event) => {
                          setEmail(event.nativeEvent.text);
                      }}
                    />
                  </View>
                }
                { verifyEmail && password &&
                  <View style={styles.gestureTab}>
                    <Image src={"https://i.ibb.co/7tcnc44/Logo-small-2.png"} style={styles.stickyLogo} />
                    <TextInput
                      style={styles.input}
                      placeholder="이메일을 입력해주세요"
                      autoCapitalize="none"
                      onEndEditing={(event) => {
                          setEmail(event.nativeEvent.text);
                      }}
                    />
                  </View>
                }
                { verifyEmail && password && name &&
                  <View style={styles.gestureTab}>
                    <Image src={"https://i.ibb.co/7tcnc44/Logo-small-2.png"} style={styles.stickyLogo} />
                    <TextInput
                      style={styles.input}
                      placeholder="이메일을 입력해주세요"
                      autoCapitalize="none"
                      onEndEditing={(event) => {
                          setEmail(event.nativeEvent.text);
                      }}
                    />
                  </View>
                }
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: Height,
    },
    stickyLogo: {
        width: "40%",
        height: "20%",
        resizeMode: 'contain',
    },
    gestureTab: {
        width: Width,
        height: Height,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: Height/5,
    },
    input: {
        width: "90%",
        height: "9.5%",
        fontSize: 17,
        borderRadius: 10,
        paddingHorizontal: "5%",
        marginTop: Height/6.5,
        borderWidth: 2,
        borderColor: '#9a9a9a',
        color: '#000',
    },
    verifyButton: {
        height: "100%",
        borderRadius: 10,
        backgroundColor: "#bcbcbc",
        alignItems: "center",
        justifyContent: "center",
    },
    ButtonText: {
        fontSize: 18,
        color: '#000000',
    }
});

export default SignUpScreen;
