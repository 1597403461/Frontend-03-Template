// 简单粗暴 Provider
const AppContext = React.createContext();
export const Provider = ({ store, children }) => <AppContext.Provider value={{ store }}>{children}</AppContext.Provider>

// 简单粗暴版 connect
import React, { useState, useContext, useEffect } from 'react';
export const connect = (mapStateToProps, mapDispatchToProps) => (WrapperComponent) => {
    const store = useContext(AppContext);
    const [state, setstate] = useState(mapStateToProps(store.getState()));
    useEffect(() => {
        const unsubScribe = store.subscribe(() => {
            const nextState = mapStateToProps(store.getState());
            if (isEqual(state, nextState)) return;
            setstate(() => nextState)
        })
        return () => {
            unsubScribe && unsubScribe();
        }
    }, []);

    let allProps = {
        ...state,
        ...mapDispatchToProps,
        ...props
    }
    return <WrapperComponent {...allProps} />
}