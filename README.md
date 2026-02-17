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

[Figma Design](https://www.figma.com/design/KcYfidtdEZsvIdawIERxHB/PassMaster?node-id=0-1&t=0XDnnXOITy6Iuhq2-1)

## Taiga

Taiga link: [Taiga](https://tree.taiga.io/project/imshad0w-tr3-passmaster/timeline)

## Tech stack

- **Frontend**: NextJS (No specific reason, was bored of Vue and Nuxt)

- **Backend**: Laravel

- **Real-time communication**: Node + Socket.IO

- **Database**: MySQL

- **Development**: Docker + Docker-Compose

- **Component Library**: Shadcn + Lucide-react

## Todos

- [x] Start by designing the flux of user and admin panel
- [x] Create Taiga for tracking the progress
- [x] Choose a tech stack
- [x] Initiate the repo and search for component library to use
- [x] Setup dev environment with Docker + Docker-Compose
- [x] Create base landing page
- [x] Create a simple page of events
- [x] Create a simple seat map
- [ ] Create a way for reserving and buying the seats
- [ ] Add real time queue for up to 5 people

## Key concepts to learn for this project

- Queue logic
- Component library (Shadcn)
- Ticket state in real-time
- Map of the chairs for real time locks
