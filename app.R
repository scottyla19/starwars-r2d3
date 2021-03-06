#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#
library(r2d3)
library(tidyverse)
planetDF <-  read.csv("sw-planets.csv")
peopleDF <- read.csv("sw-people.csv")
orbitPlanets <- planetDF %>% filter(!is.na(orbital_period)) %>% arrange(name)



ui <- fluidPage(
    tags$head(
        tags$link(rel = "stylesheet", type = "text/css", href = "styles.css"),
        tags$link(href="https://fonts.googleapis.com/css?family=Gothic+A1", rel="stylesheet")
    ),
    
    mainPanel(
    titlePanel("Star Wars People and Planets"),
    tags$h4("Not too long ago in a database far, far away...", style="font-family:  Arial ; font-size; 16px;color:#4bd5ee;"),
   
      tabsetPanel(type = "tabs",id = "inTabset",
                  tabPanel("Overview",
                                tags$div(class = "plotContainer",
                                           d3Output("mainPeople"),
                                           d3Output('mainPlanets')
                                         ) 
                           ),
                  tabPanel("People", 
                           value="People",
                           selectInput("selectPerson", "Select your character:",unique(peopleDF$person)),
                           tableOutput('peopleTable'),
                           d3Output("peopleClassification")),
                  tabPanel("Planets",
                           value="Planet",
                           selectInput("selectPlanet", "Select your planet:",unique(orbitPlanets$name)),
                           tableOutput('planetTable'),
                           d3Output("planetPage"),
                           d3Output("planetResidents")
                           )
      ),
    tags$div(class = "footer",
             tags$div(class = "footerItem",
                      tags$p("Made by ",
                             tags$a(href="https://twitter.com/scottyla1", "@scottyla1"))
            ),
            tags$div(class = "footerItem",
                     tags$p("Data provided by ",
                            tags$a(href="https://www.swapi.com", "Star Wars API"),
                            "using the ",
                            tags$a(href="https://www.rdocumentation.org/packages/rwars/versions/1.0.0", "rwars package.")
                            )
            )
    )
)
)

server <- function(input, output, session) {
    observeEvent(input$People, {
        updateSelectInput(session, "selectPerson",
                          selected = input$People
        )
        updateTabsetPanel(session, "inTabset",
                          selected = "People"
        )
    })
    
    observeEvent(input$Planet, {
      updateSelectInput(session, "selectPlanet",
                        selected = input$Planet
      )
        updateTabsetPanel(session, "inTabset",
                          selected = "Planet"
        )
        
    })
    
    output$mainPeople <- renderD3({
        r2d3(
            data = peopleDF,
            script = "main-people.js")
        
    })
    
    output$mainPlanets <- renderD3({
        r2d3(
            data = planetDF,
            script = "main-planets.js")
        
    })
    
    output$planetPage <- renderD3({
      r2d3(
        data = planetDF %>% filter(name==input$selectPlanet),
        script = "planet-page.js")
      
    })
    
    output$planetResidents <- renderD3({
      r2d3(
        data = peopleDF %>% filter(planet==input$selectPlanet),
        script = "planet-residents.js")

    })
    
    output$peopleClassification <- renderD3({
      r2d3(
        data = peopleDF,
        script = "people-classification.js")
      
    })
    
    output$planetTable <- renderTable(planetDF %>% filter(name==input$selectPlanet) %>% select(-c("terrain2","url","color")))
    
    output$peopleTable <- renderTable(peopleDF %>% filter(person==input$selectPerson) %>% select(c("person","height","mass","hair_color","skin_color","birth_year"
                                                                                                      ,"eye_color","gender","planet","species_name")))
    # output$planetDayNight <- renderD3({
    #   r2d3(
    #     data = planetDF %>% filter(name==input$selectPlanet),
    #     script = "planet-day-night.js")
    #   
    # })
    
    output$People <- renderText({
        input$People
    })
    
    output$Planet <- renderText({
        input$Planet
    })
}


# Run the application 
shinyApp(ui = ui, server = server)
