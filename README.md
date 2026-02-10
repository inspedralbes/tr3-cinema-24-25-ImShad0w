# PassMaster

## Objective

Create a real-time ticket buying app, for big events and other stuff.

Things the project has to have:

1. Real time map for buying the tickets
2. Tickets with 3 states: Not bought | Reserved | Bought
3. Queue for limit of 10 people, so that maximum only 10 people can buy tickets
4. Admin and User panel, admin for creating and adding new events and user panel for being able to buy the tickets
5. User will get a copy of the ticket to his mail
6. Once the user reserves a ticket it will automatically dispatch if the user doesn't buy it in 5 mins

## Design

Will create the design in figma

## Tech stack

- **Frontend**: NextJS + Konva

- **Backend**: Laravel

- **Real-time communication**: Node + Socket.IO

- **Database**: MySQL

- **Development**: Docker + Docker-Compose

- **Component Library**: Shadcn

## Todos

- [ ] Start by designing the flux of user and admin panel
- [ ] Create Taiga for tracking the progress
- [x] Choose a tech stack
- [x] Initiate the repo and search for component library to use

## Key concepts to learn for this project

- Queue logic
- Component library (Shadcn)
- Ticket state in real-time
- Map of the chairs for real time locks
