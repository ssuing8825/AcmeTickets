#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/runtime:3.1 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["AcmeTickets.FraudProtection.Endpoint/AcmeTickets.FraudProtection.Endpoint.csproj", "AcmeTickets.FraudProtection.Endpoint/"]
RUN dotnet restore "AcmeTickets.FraudProtection.Endpoint/AcmeTickets.FraudProtection.Endpoint.csproj"
COPY . .
WORKDIR "/src/AcmeTickets.FraudProtection.Endpoint"
RUN dotnet build "AcmeTickets.FraudProtection.Endpoint.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AcmeTickets.FraudProtection.Endpoint.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AcmeTickets.FraudProtection.Endpoint.dll"]
