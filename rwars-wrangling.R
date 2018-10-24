library(tidyverse)
library(rwars)
library(r2d3)

planets <- get_all_planets(parse_result = TRUE)

planList <- planets$results
prevRes <- planets

for (i in seq(2,7)) {
  currList <- get_all_planets(getElement(prevRes, "next"))
  planList <- append(planList, currList$results)
  prevRes <- currList
}

planetDF <- as.data.frame(planList[[1]][c(1,2,3,4,5,6,7,8,9,length(planList[[1]]))],stringsAsFactors = FALSE)
for (j in seq(2,length(planList))) {
  currDF <- as.data.frame(planList[[j]][c(1,2,3,4,5,6,7,8,9,length(planList[[j]]))],stringsAsFactors = FALSE)
  planetDF <- rbind(planetDF, currDF)
}

planetDF$url <- str_extract( planetDF$url , "\\d+")

people <- get_all_people(parse_result = TRUE)

peopleList <- people$results
prevRes <- people

for (i in seq(2,9)) {
  currList <- get_all_people(getElement(prevRes, "next"))
  peopleList <- append(peopleList, currList$results)
  prevRes <- currList
}

peopleDF <- as.data.frame(peopleList[[1]][c("name","height","mass","hair_color","skin_color","eye_color","birth_year","gender","homeworld","species")],stringsAsFactors = FALSE)
for (j in seq(2,length(peopleList))) {
  
  if(length(peopleList[[j]]["species"][[1]]) > 0){
    peopleList[[j]]["species"] <- peopleList[[j]]["species"][[1]]
  }
  if(is_empty(peopleList[[j]]["species"][[1]])){
    peopleList[[j]]["species"] <- NA
  }
  currDF <- as.data.frame(peopleList[[j]][c("name","height","mass","hair_color","skin_color","eye_color","birth_year","gender","homeworld","species")],stringsAsFactors = FALSE)
  
  peopleDF <- rbind(peopleDF, currDF)
}

peopleDF$homeworld <- str_extract( peopleDF$homeworld, "\\d+")
peopleDF$species <- str_extract( peopleDF$species, "\\d+")


peopleDF$skin_color <- gsub(",.*$", "",  peopleDF$skin_color)
planetDF[planetDF == "unknown"] <- NA
peopleDF[peopleDF == "unknown"] <- NA
peopleDF[peopleDF == "n/a"] <- NA
peopleDF[peopleDF == "none"] <- NA
peopleDF$height <- as.numeric(as.character(peopleDF$height))
peopleDF$mass <- as.numeric(as.character(peopleDF$mass))

peopleDF$gender <- peopleDF$gender %>% replace_na("droid")




planetDF$terrain2 <-  unlist(lapply(strsplit(as.character(planetDF$terrain), ","), '[[', 1))



planetDF$terrain2 <- ifelse(grepl("cit.*", planetDF$terrain2 ), "city",planetDF$terrain2 )
planetDF$terrain2 <- ifelse(grepl("forest.*", planetDF$terrain2 ), "forest",planetDF$terrain2 )
planetDF$terrain2 <- ifelse(grepl("rocky.*", planetDF$terrain2 ), "rocky",planetDF$terrain2 )
planetDF$terrain2 <- ifelse(grepl("s{1}$", planetDF$terrain2 ), sub("s$","",planetDF$terrain2) ,planetDF$terrain2 )
planetDF$terrain2 <- ifelse(grepl("gras.*", planetDF$terrain2 ), "grass",planetDF$terrain2 )

unique(planetDF$terrain2)
v1 <- unique(planetDF$terrain2)
v2 <- c("#7cfc00","#29ab87","#dde7f2","#A3AE7E","#B45C3D","#228b22","#8d8d8d","#0077be",
        "#808487","#aab5a8","#CF1020","#5f4e43","#aad3e9","#977c53","#13120e","#c2a685",
        "#55636d","#808487","black","#c2b280 ","#d0dbc5","#93e51e","#a7d3a8","#579da6")
planetDF$color <- lapply(planetDF$terrain2, function(x) v2[match(x,v1)])
planetDF$color = as.character(planetDF$color)




species <- get_all_species(parse_result = TRUE)

specList <- species$results
prevRes <- species

for (i in seq(2,7)) {
  currList <- get_all_species(getElement(prevRes, "next"))
  specList <- append(specList, currList$results)
  prevRes <- currList
}

specDF <- as.data.frame(specList[[1]][c(1,2,3,4,5,6,7,8,length(specList[[1]]))])
for (j in seq(2,length(planList))) {
  currDF <- as.data.frame(specList[[j]][c(1,2,3,4,5,6,7,8,length(specList[[1]]))])
  specDF <- rbind(specDF, currDF)
}

peopleDF <- merge(peopleDF,planetDF, by.x = "homeworld", by.y = "url")

peopleDF <- peopleDF %>% rename(person = name.x, planet = name.y)

specDF$url <- str_extract(specDF$url , "\\d+")
peopleDF <- merge(peopleDF,specDF[c("name","classification","designation","average_height","average_lifespan","url")], by.x = "species", by.y = "url")
peopleDF <- peopleDF %>% rename(species_name = name)                      

peopleDF <- peopleDF[!duplicated(peopleDF), ]
write_csv(planetDF, "sw-planets.csv")
write_csv(peopleDF, "sw-people.csv")
