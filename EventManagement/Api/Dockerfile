#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["AcmeTickets.EventManagement.Api/AcmeTickets.EventManagement.Api.csproj", "AcmeTickets.EventManagement.Api/"]
RUN dotnet restore "AcmeTickets.EventManagement.Api/AcmeTickets.EventManagement.Api.csproj"
COPY . .
WORKDIR "/src/AcmeTickets.EventManagement.Api"
RUN dotnet build "AcmeTickets.EventManagement.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AcmeTickets.EventManagement.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AcmeTickets.EventManagement.Api.dll"]