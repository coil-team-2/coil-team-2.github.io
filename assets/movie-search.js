function buildInput(input){
    let result = [
        {
            "id": input.id,
            "voteCount": input.vote_count,
            "revenue": input.revenue,
            "runtime": input.runtime,
            "budget": input.budget,
            "popularity": input.popularity,
            "numVotes": input.numVotes,
            "title": input.title,
            "status": input.status,
            "releaseDate": input.release_date,
            "adult": input.adult,
            "tconst": input.tconst,
            "originalLanguage": input.original_language,
            "originalTitle": input.original_title,
            "genres": input.genres,
            "keywords": input.keywords,
            "directors": input.directors,
            "writers": input.writers,
            "cast": input.cast,
            "backdropPath": input.backdrop_path,
            "homepage": input.homepage,
            "overview": input.overview,
            "posterPath": input.poster_path,
            "tagline": input.tagline,
            "productionCompanies": input.production_companies,
            "productionCountries": input.production_countries,
            "spokenLanguages": input.spoken_languages,
            "voteAverage": input.averageRating
        }
    ]
    return result;
}

async function getPrediction(input){
    let predictionInput = buildInput(input);
    let predtionRes = await fetch('https://data-mining-t89i.onrender.com/movie-rating-prediction/api/v1/movies/predict-rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(predictionInput)
    });
    // console.log('Prediction response:', predtionRes);
    return predtionRes;
}