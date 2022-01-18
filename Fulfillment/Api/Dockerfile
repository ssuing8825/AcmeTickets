#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["AcmeTickets.FraudProtection.Api/AcmeTickets.FraudProtection.Api.csproj", "AcmeTickets.FraudProtection.Api/"]
RUN dotnet restore "AcmeTickets.FraudProtection.Api/AcmeTickets.FraudProtection.Api.csproj"
COPY . .
WORKDIR "/src/AcmeTickets.FraudProtection.Api"
RUN dotnet build "AcmeTickets.FraudProtection.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AcmeTickets.FraudProtection.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AcmeTickets.FraudProtection.Api.dll"]