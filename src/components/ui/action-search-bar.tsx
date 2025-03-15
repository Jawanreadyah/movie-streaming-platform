"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Send,
    Film,
    TrendingUp,
    Star,
    Clock
} from "lucide-react";
import { tmdb } from "@/lib/tmdb";

function useDebounce<T>(value: T, delay: number = 800): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

interface Action {
    id: string;
    label: string;
    icon: React.ReactNode;
    description?: string;
    short?: string;
    end?: string;
    genreId?: number;
    yearValue?: number;
}

interface SearchResult {
    actions: Action[];
}

const defaultActions: Action[] = [
    {
        id: "1",
        label: "Action Movies",
        icon: <Film className="h-4 w-4 text-blue-500" />,
        description: "Genre",
        short: "",
        end: "Popular",
        genreId: 28
    },
    {
        id: "2",
        label: "Comedy",
        icon: <Film className="h-4 w-4 text-orange-500" />,
        description: "Genre",
        short: "",
        end: "Popular",
        genreId: 35
    },
    {
        id: "3",
        label: "Trending Now",
        icon: <TrendingUp className="h-4 w-4 text-purple-500" />,
        description: "Movies",
        short: "",
        end: "Hot"
    },
    {
        id: "4",
        label: "New Releases",
        icon: <Clock className="h-4 w-4 text-green-500" />,
        description: "2024",
        short: "",
        end: "New",
        yearValue: 2024
    },
    {
        id: "5",
        label: "Top Rated",
        icon: <Star className="h-4 w-4 text-yellow-500" />,
        description: "Movies",
        short: "",
        end: "Best"
    },
];

interface ActionSearchBarProps {
    onSearch: (query: string, genreId?: number, year?: number) => void;
}

function ActionSearchBar({ onSearch }: ActionSearchBarProps) {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<SearchResult | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedAction, setSelectedAction] = useState<Action | null>(null);
    const [genreActions, setGenreActions] = useState<Action[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 800);

    // Auto-search when query changes
    useEffect(() => {
        if (debouncedQuery.trim() && !isLoading) {
            setIsLoading(true);
            onSearch(debouncedQuery, undefined, undefined);
            // Set a timeout to ensure loading state is cleared
            setTimeout(() => setIsLoading(false), 500);
        }
    }, [debouncedQuery, onSearch, isLoading]);

    // Fetch genres on mount
    useEffect(() => {
        const loadGenres = async () => {
            try {
                const genreList = await tmdb.getGenres();
                
                // Create genre actions
                const genreActionList = genreList.map((genre) => ({
                    id: `genre-${genre.id}`,
                    label: genre.name,
                    icon: <Film className="h-4 w-4 text-blue-500" />,
                    description: "Genre",
                    end: "Filter",
                    genreId: genre.id
                }));
                
                setGenreActions(genreActionList);
            } catch (error) {
                console.error("Error loading genres:", error);
            }
        };
        
        loadGenres();
    }, []);

    // Update results when focus changes
    useEffect(() => {
        if (!isFocused) {
            setResult(null);
            return;
        }

        // Show genres and default actions when focused
        const filteredGenres = !query.trim() 
            ? genreActions 
            : genreActions.filter(genre => 
                genre.label.toLowerCase().includes(query.toLowerCase()));

        const filteredDefaults = !query.trim()
            ? defaultActions
            : defaultActions.filter(action => 
                action.label.toLowerCase().includes(query.toLowerCase()));

        // Combine genre actions with default actions
        const combinedActions = [
            ...filteredGenres.slice(0, 10),
            ...filteredDefaults.slice(0, 5)
        ];
        
        setResult({ actions: combinedActions });
    }, [query, isFocused, genreActions]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleActionSelect = (action: Action) => {
        setSelectedAction(action);
        
        // Handle different action types
        if (action.genreId) {
            // Search by genre
            onSearch("", action.genreId);
        } else if (action.yearValue) {
            // Search by year
            onSearch("", undefined, action.yearValue);
        } else {
            // Handle default actions
            switch(action.label) {
                case "Trending Now":
                    onSearch("trending");
                    break;
                case "Top Rated":
                    onSearch("top rated");
                    break;
                default:
                    // Search by text query
                    onSearch(action.label);
            }
        }
        
        setIsFocused(false);
    };

    const handleSearch = () => {
        if (query && !isLoading) {
            setIsLoading(true);
            onSearch(query);
            // Set a timeout to ensure loading state is cleared
            setTimeout(() => setIsLoading(false), 500);
            setIsFocused(false);
        }
    };

    const container = {
        hidden: { opacity: 0, height: 0 },
        show: {
            opacity: 1,
            height: "auto",
            transition: {
                height: {
                    duration: 0.4,
                },
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: {
                height: {
                    duration: 0.3,
                },
                opacity: {
                    duration: 0.2,
                },
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2,
            },
        },
    };

    // Reset selectedAction when focusing the input
    const handleFocus = () => {
        setSelectedAction(null);
        setIsFocused(true);
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="relative flex flex-col justify-start items-center min-h-[56px]">
                <div className="w-full max-w-sm sticky top-0 bg-background z-10 pt-4 pb-1">
                    <label
                        className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block"
                        htmlFor="search"
                    >
                        Search Movies
                    </label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search movies, genres..."
                            value={query}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={() =>
                                setTimeout(() => setIsFocused(false), 200)
                            }
                            className="pl-3 pr-9 py-1.5 h-9 text-sm rounded-lg focus-visible:ring-offset-0"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer" onClick={handleSearch}>
                            <AnimatePresence mode="popLayout">
                                {query.length > 0 ? (
                                    <motion.div
                                        key="send"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Send className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="search"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-sm">
                    <AnimatePresence>
                        {isFocused && result && !selectedAction && (
                            <motion.div
                                className="w-full border rounded-md shadow-sm overflow-hidden dark:border-gray-800 bg-black/90 backdrop-blur-sm mt-1"
                                variants={container}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                            >
                                <motion.ul>
                                    {result.actions.map((action) => (
                                        <motion.li
                                            key={action.id}
                                            className="px-3 py-2 flex items-center justify-between hover:bg-gray-800 cursor-pointer rounded-md"
                                            variants={item}
                                            layout
                                            onClick={() => handleActionSelect(action)}
                                        >
                                            <div className="flex items-center gap-2 justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400">
                                                        {action.icon}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-100">
                                                        {action.label}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {action.description}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400">
                                                    {action.short}
                                                </span>
                                                <span className="text-xs text-gray-400 text-right">
                                                    {action.end}
                                                </span>
                                            </div>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                                <div className="mt-2 px-3 py-2 border-t border-gray-800">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Browse by genre or category</span>
                                        <span>ESC to cancel</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export { ActionSearchBar };
export type { Action };
