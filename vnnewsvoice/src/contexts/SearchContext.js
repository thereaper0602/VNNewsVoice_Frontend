import { createContext, useState } from "react";


const SearchContext = createContext();

const SearchContextProvider = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGenerator, setSelectedGenerator] = useState('');



    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, selectedGenerator, setSelectedGenerator }}>
            {props.children}
        </SearchContext.Provider>
    );
}

export { SearchContext, SearchContextProvider };

