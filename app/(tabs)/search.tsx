import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchQuery } from "@/services/appwrite";
import { useFetch } from "@/services/useFetch";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const {
		data: movies,
		loading: moviesLoading,
		error: moviesError,
		refetch: loadMovies,
		reset,
	} = useFetch(() => fetchMovies({ query: searchTerm }), false);

	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			if (searchTerm.trim()) {
				await loadMovies();
				if (movies.length > 0 && movies?.[0]) {
					await updateSearchQuery(searchTerm, movies?.[0]);
				}
			} else {
				reset();
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchTerm]);

	useEffect(() => {
		if (movies?.length > 0 && movies?.[0]) {
			updateSearchQuery(searchTerm, movies?.[0]);
		}
	}, [movies]);
	return (
		<View className="flex-1 bg-primary">
			<Image source={images.bg} className="w-full absolute z-0 flex-1" />

			<FlatList
				data={movies}
				renderItem={({ item }) => <MovieCard {...item} />}
				keyExtractor={(item) => item.id.toString()}
				className="px-5"
				numColumns={3}
				columnWrapperStyle={{
					justifyContent: "center",
					gap: 16,
					marginVertical: 16,
				}}
				contentContainerStyle={{ paddingBottom: 100 }}
				ListHeaderComponent={
					<>
						<View className="w-full flex-row justify-center mt-20 items-center">
							<Image source={icons.logo} className="w-12 h-10" />
						</View>
						<View className="my-5">
							<SearchBar
								placeholder="Search Movies..."
								value={searchTerm}
								onChangeText={(text) => setSearchTerm(text)}
							/>
						</View>

						{moviesLoading && (
							<ActivityIndicator
								size={"large"}
								color={"#0000ff"}
								className=""
							/>
						)}

						{moviesError && (
							<Text className="text-red-500 px-5 my-3">
								Error: {moviesError.message}
							</Text>
						)}

						{!moviesLoading &&
							!moviesError &&
							searchTerm.trim() &&
							movies?.length > 0 && (
								<Text className="text-xl text-white font-bold">
									Search Results for{" "}
									<Text className="text-accent">{searchTerm}</Text>
								</Text>
							)}
					</>
				}
				ListEmptyComponent={
					!moviesLoading && !moviesError ? (
						<View className="mt-10 px-5">
							<Text className="text-center text-gray-500">
								{searchTerm.trim() ? "No movie found" : "Search for a movie"}
							</Text>
						</View>
					) : null
				}
			/>
		</View>
	);
};

export default Search;
