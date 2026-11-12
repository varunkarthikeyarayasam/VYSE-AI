export interface SathyabamaBusStop {
  order: number;
  name: string;
  time: string;
  lat: number;
  lng: number;
  isOrigin?: boolean;
  isDestination?: boolean;
}

export interface SathyabamaBusRoute {
  slNo: number;
  routeNo: string;
  vehicleNo: string;
  driverName: string;
  phoneNumber: string;
  origin: string;
  viaStops: string[];
  destination: string;
  zone:
    | "Tambaram & GST"
    | "OMR & Velachery"
    | "ECR Coastal"
    | "Central Chennai"
    | "West Chennai (Porur/Guindy)"
    | "North Chennai"
    | "Outer Suburbs";
  departureTime: string;
  arrivalTime: string;
  campusInTime: string;
  stops: SathyabamaBusStop[];
}

// Landmark & neighborhood coordinate dictionary across Chennai metropolitan region
export const CHENNAI_COORDS: Record<string, { lat: number; lng: number }> = {
  // Sathyabama Campus (Jeppiaar Nagar, OMR)
  "Sathyabama Campus": { lat: 12.8735, lng: 80.2212 },
  "Jeppiaar Nagar": { lat: 12.8735, lng: 80.2212 },
  "Semmencherry": { lat: 12.8688, lng: 80.2225 },
  "Semmencherry Alamaram": { lat: 12.8688, lng: 80.2225 },

  // OMR Corridor
  "Navalur": { lat: 12.8468, lng: 80.2267 },
  "Marina Mall": { lat: 12.8468, lng: 80.2267 },
  "Siruseri": { lat: 12.8335, lng: 80.2215 },
  "SIPCOT": { lat: 12.8335, lng: 80.2215 },
  "Padur": { lat: 12.8122, lng: 80.2291 },
  "Kazhipattur": { lat: 12.8256, lng: 80.2281 },
  "Kelambakkam": { lat: 12.7872, lng: 80.2198 },
  "Sholinganallur": { lat: 12.9010, lng: 80.2279 },
  "Karapakkam": { lat: 12.9152, lng: 80.2312 },
  "PTC": { lat: 12.9234, lng: 80.2335 },
  "Mettukuppam": { lat: 12.9328, lng: 80.2356 },
  "Thoraipakkam": { lat: 12.9431, lng: 80.2372 },
  "Perungudi": { lat: 12.9644, lng: 80.2443 },
  "Kandhanchavadi": { lat: 12.9691, lng: 80.2465 },
  "SRP Tools": { lat: 12.9785, lng: 80.2492 },
  "Tidel Park": { lat: 12.9892, lng: 80.2486 },
  "Madhyakailash": { lat: 13.0078, lng: 80.2481 },

  // ECR Coastal
  "Thiruvanmiyur": { lat: 12.9830, lng: 80.2594 },
  "Kottivakkam": { lat: 12.9667, lng: 80.2604 },
  "Palavakkam": { lat: 12.9556, lng: 80.2592 },
  "Neelankarai": { lat: 12.9482, lng: 80.2589 },
  "Injambakkam": { lat: 12.9221, lng: 80.2536 },
  "VGP": { lat: 12.9185, lng: 80.2528 },
  "Akkarai": { lat: 12.9022, lng: 80.2482 },
  "Panaiyur": { lat: 12.8885, lng: 80.2472 },
  "Uthandi": { lat: 12.8631, lng: 80.2465 },
  "Kovalam": { lat: 12.7932, lng: 80.2514 },
  "Mahabalipuram": { lat: 12.6208, lng: 80.1945 },
  "Kalpakkam": { lat: 12.5012, lng: 80.1582 },

  // Tambaram & GST
  "Tambaram": { lat: 12.9249, lng: 80.1000 },
  "Tambaram Railway Station": { lat: 12.9249, lng: 80.1000 },
  "Tambaram West": { lat: 12.9265, lng: 80.0982 },
  "MCC College": { lat: 12.9212, lng: 80.1189 },
  "Selaiyur": { lat: 12.9192, lng: 80.1345 },
  "Camp Road": { lat: 12.9168, lng: 80.1412 },
  "Sembakkam": { lat: 12.9210, lng: 80.1582 },
  "Rajakilpakkam": { lat: 12.9234, lng: 80.1501 },
  "Kamarajapuram": { lat: 12.9189, lng: 80.1652 },
  "Medavakkam": { lat: 12.9174, lng: 80.1923 },
  "Medavakkam Koot Road": { lat: 12.9180, lng: 80.1885 },
  "Perumbakkam": { lat: 12.9056, lng: 80.1982 },
  "Sithalapakkam": { lat: 12.8932, lng: 80.1845 },
  "Chromepet": { lat: 12.9516, lng: 80.1462 },
  "Sanatorium": { lat: 12.9385, lng: 80.1245 },
  "Pallavaram": { lat: 12.9675, lng: 80.1491 },
  "Pammal": { lat: 12.9723, lng: 80.1354 },
  "Vandalur": { lat: 12.8912, lng: 80.0812 },
  "Kandigai": { lat: 12.8685, lng: 80.1256 },
  "Mambakkam": { lat: 12.8423, lng: 80.1624 },
  "Guduvancherry": { lat: 12.8439, lng: 80.0605 },
  "Urapakkam": { lat: 12.8672, lng: 80.0712 },
  "Perungulathur": { lat: 12.9048, lng: 80.0891 },
  "Chengalpattu": { lat: 12.6939, lng: 79.9757 },

  // Velachery & South Central
  "Velachery": { lat: 12.9815, lng: 80.2180 },
  "Velachery Railway Station": { lat: 12.9782, lng: 80.2154 },
  "Vijaya Nagar": { lat: 12.9754, lng: 80.2201 },
  "Tansi Nagar": { lat: 12.9723, lng: 80.2234 },
  "Baby Nagar": { lat: 12.9765, lng: 80.2245 },
  "Taramani": { lat: 12.9863, lng: 80.2432 },
  "Adyar": { lat: 13.0012, lng: 80.2565 },
  "Besant Nagar": { lat: 13.0003, lng: 80.2667 },
  "Mylapore": { lat: 13.0368, lng: 80.2676 },
  "Mandaveli": { lat: 13.0245, lng: 80.2612 },
  "Saidapet": { lat: 13.0213, lng: 80.2231 },
  "Little Mount": { lat: 13.0182, lng: 80.2294 },
  "Guindy": { lat: 13.0067, lng: 80.2026 },
  "T. Nagar": { lat: 13.0418, lng: 80.2341 },
  "Panagal Park": { lat: 13.0401, lng: 80.2325 },
  "Kodambakkam": { lat: 13.0526, lng: 80.2206 },
  "Nandanam": { lat: 13.0289, lng: 80.2412 },

  // West & North Chennai
  "Porur": { lat: 13.0382, lng: 80.1565 },
  "Ramapuram": { lat: 13.0312, lng: 80.1789 },
  "Vadapalani": { lat: 13.0500, lng: 80.2121 },
  "Koyambedu": { lat: 13.0694, lng: 80.1948 },
  "Anna Nagar": { lat: 13.0850, lng: 80.2101 },
  "Ambattur": { lat: 13.1143, lng: 80.1548 },
  "Avadi": { lat: 13.1147, lng: 80.1008 },
  "Poonamallee": { lat: 13.0474, lng: 80.0945 },
  "Perambur": { lat: 13.1110, lng: 80.2435 },
  "Madhavaram": { lat: 13.1489, lng: 80.2306 },
  "Red Hills": { lat: 13.1994, lng: 80.1972 },
  "Central": { lat: 13.0827, lng: 80.2707 },
  "Egmore": { lat: 13.0732, lng: 80.2609 },
  "Royapuram": { lat: 13.1092, lng: 80.2945 },
  "Tondiarpet": { lat: 13.1256, lng: 80.2891 },
  "Thiruvotriyur": { lat: 13.1610, lng: 80.3012 },
  "Kanchipuram": { lat: 12.8342, lng: 79.7036 },
  "Sriperumbudur": { lat: 12.9699, lng: 79.9405 },
};

function resolveCoord(name: string): { lat: number; lng: number } {
  const clean = name.trim().toLowerCase();
  for (const [key, coord] of Object.entries(CHENNAI_COORDS)) {
    if (clean.includes(key.toLowerCase()) || key.toLowerCase().includes(clean)) {
      return coord;
    }
  }
  // Interpolation around Chennai radius
  return { lat: 12.9200 + (Math.sin(clean.length) * 0.05), lng: 80.2000 + (Math.cos(clean.length) * 0.04) };
}

// Raw OCR Table Data from Sathyabama Transport Department (28/08/2026)
export const RAW_SATHYABAMA_ROUTES: Array<{
  slNo: number;
  routeNo: string;
  vehicleNo: string;
  driverName: string;
  phoneNumber: string;
  rawText: string;
}> = [
  { slNo: 1, routeNo: "1", vehicleNo: "AU2877", driverName: "IP VENKATESAN", phoneNumber: "9789933356", rawText: "Cheyyar-(Via)-Kancheepuram Walajabath-Oragadam-Padapai-Mannivakkam-Vandalore-Kandigai" },
  { slNo: 2, routeNo: "1A", vehicleNo: "AU2787", driverName: "POONGAVANAM", phoneNumber: "9976265471", rawText: "Vandhavasi-(Via)-Kancheepuram Walajabath–Oragadam-Padapai-Mannivakkam-Vandalore- Kandigai-Kolabakkam-Mambakkam" },
  { slNo: 3, routeNo: "1B", vehicleNo: "AF2787", driverName: "B.K.PERUMAL", phoneNumber: "9710033537", rawText: "Kancheepuram-(via)- Walajabath-Oragadam-Padapai-Mannivakkam-Vandalore-Kolabakkam-Kandigai" },
  { slNo: 4, routeNo: "1C", vehicleNo: "AU3786", driverName: "VIGNESHWARAN", phoneNumber: "7538893122", rawText: "Kancheepuram-(via)- Walajabath-Oragadam –Padapai-Mannivakkam-Vandalore-Kandigai- Mambakkam" },
  { slNo: 5, routeNo: "1D", vehicleNo: "AU3678", driverName: "K.C.IGNATIOUS", phoneNumber: "9677924655", rawText: "Sriperumbudur-(via)-Pushpagiri-Manimangalam-Vandalore-Kolabakkam-Kandigai" },
  { slNo: 6, routeNo: "1E", vehicleNo: "AU3768", driverName: "SURESH", phoneNumber: "6384119283", rawText: "Kancheepuram (Via)-Walajabath–Oragadam-Padapai- Mannivakkam-Vandalore- Kandigai-Kolabakkam-Mambakkam-Kelambakkam" },
  { slNo: 7, routeNo: "1F", vehicleNo: "AK6747", driverName: "RAJA", phoneNumber: "6384028825", rawText: "Kancheepuram-(via)- Walajabath-Oragadam-Padapai-Mannivakkam-Vandalore-Kolabakkam-Kandigai" },
  { slNo: 8, routeNo: "2", vehicleNo: "AQ7449", driverName: "SANKAR", phoneNumber: "7639258401", rawText: "Melmaruvathur-(Via)-Madhuranthakam -Bhukkathurai-Chengalpet-Raatina Kinaru-Thiruporur Koot Road- Thiruvadisoolam-Mullibakkam-Karumbakkam" },
  { slNo: 9, routeNo: "2A", vehicleNo: "AQ9627", driverName: "RAMALINGAM", phoneNumber: "9841528831", rawText: "Madhuranthakam-(Via)-Karunkuzhi-Maamandur-Patalam-Chengalpattu-ThiruporurKoot Road-Thiruvadisoolam-Mullibakkam-Karumbakkam" },
  { slNo: 10, routeNo: "2B", vehicleNo: "AF2697", driverName: "DEVAKUMAR", phoneNumber: "8098325148", rawText: "Uthiramerur-(Via)-Bhukkathurai-Chengalpet Bye pass-Chengalpet bus stand- Raatina Kinaru-Thiruporur Koot Road" },
  { slNo: 11, routeNo: "2C", vehicleNo: "AM7764", driverName: "DEVARAJAN", phoneNumber: "9790405526", rawText: "Chengalpet Bye pass –(Via)-Raatina Kinaru-Thiruporur Koot Road- Thiruvadisoolam-Mullibakkam-Karumbakkam" },
  { slNo: 12, routeNo: "2D", vehicleNo: "AM7746", driverName: "BALRAJ", phoneNumber: "9600723664", rawText: "Raatina Kinaru-(Via)-Thiruporur Koot Road-Thiruvadisoolam-Mullibakkam-Karumbakkam-Kottamedu-Thiruporur-Kalavakkam" },
  { slNo: 13, routeNo: "2E", vehicleNo: "AU2733", driverName: "SAMINADAN", phoneNumber: "9791076133", rawText: "Thiruporur Koot Road-(Via)-Thiruvadisoolam-Mullibakkam-Karumbakkam-Kottamedu-Thiruporur" },
  { slNo: 14, routeNo: "2F", vehicleNo: "AD6774", driverName: "PRABHAKAR", phoneNumber: "8870887975", rawText: "Chengalpet-(via)- Paranur-S.P.Kovil-M.M. Nagar –SRM-Guduvancherry-Urapakkam-Vandalore-Kandigai-Mambakkam-Kelambakkam" },
  { slNo: 15, routeNo: "2G", vehicleNo: "BW9933", driverName: "PANNEER", phoneNumber: "9894027380", rawText: "Chengalpet-(via)- Paranur-S.P.Kovil-M.M. Nagar –SRM-Guduvancherry-Urapakkam-Kilambakkam-Vandalore-Kandigai- Mambakkam" },
  { slNo: 16, routeNo: "2H", vehicleNo: "AD7737", driverName: "BALAMURALI", phoneNumber: "8939896896", rawText: "Chengalpet-(via)- Paranur-S.P.Kovil-M.M. Nagar –SRM-Guduvancherry-Urapakkam-Kilambakkam-Vandalore-Kandigai- Mambakkam" },
  { slNo: 17, routeNo: "3", vehicleNo: "AQ9447", driverName: "GNANAM", phoneNumber: "9344340721", rawText: "Kannivakkam-(Via)-Kaayarmedu-Guduvancherry-Urapakkam-Kilambakkam-Vandalore-Kolambakkam-Kandigai" },
  { slNo: 18, routeNo: "3A", vehicleNo: "BW1212", driverName: "PANNEER", phoneNumber: "9789845536", rawText: "Guduvancherry –(Via)-Urapakkam-Kilambakkam-Vandalore-Kolambakkam-Mambakkam-Kelambakkam-Padur" },
  { slNo: 19, routeNo: "3B", vehicleNo: "AF2517", driverName: "JAYACHANDRAN", phoneNumber: "8667063867", rawText: "Urapakkam-(via)- Vandalore-Kolabakkam-Mela kottaiyur-Keela kottaiyur-Mambakkam-Pudubakkam-Kelambakkam" },
  { slNo: 20, routeNo: "3C", vehicleNo: "AU3876", driverName: "TAMIL", phoneNumber: "8056287443", rawText: "Vandalore-(Via)-Kolambakkam-Kandigai- Mela kottaiyur-Keela kottaiyur-Mambakkam-Kelambakkam-Padur" },
  { slNo: 21, routeNo: "3D", vehicleNo: "BW8484", driverName: "SHANKAR", phoneNumber: "9025036160", rawText: "Vandalore-(Via)-Kolambakkam-Kandigai- Mela kottaiyur-Keela kottaiyur-Mambakkam-Kelambakkam-Padur" },
  { slNo: 22, routeNo: "3E", vehicleNo: "AF2373", driverName: "SRIKANTH", phoneNumber: "9840749240", rawText: "Vandalore-(Via)-Kolambakkam-Kandigai- Mela kottaiyur-Keela kottaiyur-Mambakkam-Kelambakkam-Padur" },
  { slNo: 23, routeNo: "4", vehicleNo: "AQ9573", driverName: "BALAMURUGAN", phoneNumber: "8608731764", rawText: "Marakanam-(Via)-Kovathur-Kathankadai-Veppancherry-Kalpakkam Indranagar-Vengambakkam-Poonjeri Toll Gate-Thiruporur-Kelambakkam" },
  { slNo: 24, routeNo: "4A", vehicleNo: "AU2778", driverName: "KUMAR", phoneNumber: "9789921037", rawText: "Kovathur-(Via)-Kathankadai-Veppancherry-Kalpakkam Indra nagar-Vengambakkam-Poonjeri Toll Gate-Thiruporur-Kelambakkam" },
  { slNo: 25, routeNo: "4B", vehicleNo: "AD7179", driverName: "ARJUNAN", phoneNumber: "9566758203", rawText: "Kalpakkam-(via)-Kalpakkam Ladies Hostel-Satras Gate-Vengambakkam-Poonjeri Toll gate-Thiruporur" },
  { slNo: 26, routeNo: "4C", vehicleNo: "AM6027", driverName: "K.SURESH", phoneNumber: "9943621396", rawText: "Thirukazhukundram-(via)-Mahabalipuram–Deveneri–Thiruvidanthai-Pattipulam-Vadanemmeli- Perur- Kovalam" },
  { slNo: 27, routeNo: "4D", vehicleNo: "AM6171", driverName: "SRIDHAR", phoneNumber: "9884112641", rawText: "Kothimangalam-(Via)-Eachur-Mamallapuram-Devaneri–Therkupattu-Kovalam-Kelambakkam-Padur" },
  { slNo: 28, routeNo: "4E", vehicleNo: "AD7557", driverName: "KARUNAKARAN", phoneNumber: "9566826211", rawText: "Kalpakkam-(Via)-Vengambakkam-Kunnapattu-Poonjeri-Mahabalipuram-Pattipulam-Thiruvidanthai-Kovalam- Kelambakkam" },
  { slNo: 29, routeNo: "4F", vehicleNo: "AD8799", driverName: "ANBU", phoneNumber: "9789588217", rawText: "Kalpakkam-(via)-Vengambakkam-Anupuram-Poonjeri Toll Gate-Thiruporur-Kalavakkam-Kelambakkam" },
  { slNo: 30, routeNo: "4G", vehicleNo: "AU3867", driverName: "VEERARAGAVAN", phoneNumber: "9626815910", rawText: "Thirukazhukundram-(via)-Kothimangalam-Poonjeri Toll Gate-Alathur-Thandalam-Thiruporur-Kalavakkam" },
  { slNo: 31, routeNo: "5", vehicleNo: "AD8979", driverName: "JAYAKUMAR", phoneNumber: "9171960721", rawText: "Maanapathy-(Via)-Ambur-Thiruporur Rountana-Kalavakkam-Vijaya Shanthi Apartments-Kelambakkam-Padur-Navalur" },
  { slNo: 32, routeNo: "5A", vehicleNo: "AK9177", driverName: "ELUMALAI", phoneNumber: "6380756489", rawText: "Thiruporur-(via)-Kalavakkam- Vijaya Shanthi Apartments-Kelambakkam-Padur-Navalur" },
  { slNo: 33, routeNo: "5B", vehicleNo: "AK7377", driverName: "RATHNAM", phoneNumber: "9840647662", rawText: "Kayar-(Via)-Vembedu-Ellalur-Thiruporur-Kalavakkam-Vijaya Shanthi Apartments-Kelambakkam-Padur-Navalur" },
  { slNo: 34, routeNo: "5C", vehicleNo: "AS8376", driverName: "MANIVARMAN", phoneNumber: "8056174165", rawText: "Kelambakkam-(via)- Padur–Kazhipattur-Navalur-Ags-Semmencherry Alamaram" },
  { slNo: 35, routeNo: "5D", vehicleNo: "Y0969", driverName: "SURESH", phoneNumber: "9500100742", rawText: "Thiruporur-(Via)-Kalavakkam- Vijaya Shanthi Apartments Kelambakkam-Padur-Navalur" },
  { slNo: 36, routeNo: "5E", vehicleNo: "CY6567", driverName: "RAVI", phoneNumber: "9003433167", rawText: "Kelambakkam-(via)- Padur–Kazhipattur-Navalur-Ags-Semmencherry Alamaram" },
  { slNo: 37, routeNo: "6", vehicleNo: "AQ9537", driverName: "KARTHICK", phoneNumber: "8248993037", rawText: "Thalankuppam-(Via)-Ennore-Ernavur – Vimco Nagar-Thiruvotriyur-Theradi-Toll gate-Tondiarpet- Kasimedu-Kalmandabam-Royapuram" },
  { slNo: 38, routeNo: "6A", vehicleNo: "AK9717", driverName: "SARAVANAN", phoneNumber: "7305554693", rawText: "Vimco Nagar-(Via)- Thiruvotriyur-Theradi- Tondiarpet – Kalra Hospital-Kasimedu- Kalmandabam-Royapuram-Light house-Santhome-Pattinambakkam-ECR" },
  { slNo: 39, routeNo: "6B", vehicleNo: "AK7197", driverName: "NIRMAL", phoneNumber: "9123518260", rawText: "Thiruvotriyur-(via)-Theradi –Tondiarpettoll gate- Kasimedu-Royapuram- Beach Station-Parrys Corner-Anna square-Light House-Santhome-Pattinambakkam" },
  { slNo: 40, routeNo: "6C", vehicleNo: "AF1779", driverName: "DHATCHANA", phoneNumber: "9543134134", rawText: "Tondiarpet Toll gate-(Via)-Appollo-Tondiarpet metro-Manikoondu-Maharani post office-Singapore shopping-Cement road-Royapuram" },
  { slNo: 41, routeNo: "6D", vehicleNo: "AQ7458", driverName: "PANDIAN", phoneNumber: "9940266504", rawText: "Tondiarpet Toll gate-(Via)-Lakshmi temple-Appollo-Mani Cycle-Tondiarpet metro-Manikoondu-Maharani post office-Singapore shopping-Cement road-depo-Water tank-ECR" },
  { slNo: 42, routeNo: "6E", vehicleNo: "AQ7287", driverName: "SIVAKUMAR", phoneNumber: "9940177216", rawText: "Mint bharath theatre-(Via)-Pencil factory-Mint Metro-Stanli-Bharathi Arts college-Broadway theatre-Mannadi metro-High court" },
  { slNo: 43, routeNo: "6F", vehicleNo: "AD7287", driverName: "RAJENDRAN", phoneNumber: "8438176290", rawText: "Tondiarpet Toll gate-(Via)-Appollo-Tondiarpet metro-Manikoondu-Maharani post office-Singapore shopping-Cement road" },
  { slNo: 44, routeNo: "6G", vehicleNo: "AK9771", driverName: "PRAVEEN", phoneNumber: "7550106909", rawText: "Thiruvotriyur-(via)-Theradi – Tondiarpet toll gate-Kalra Hospital- Kasimedu-Royapuram - Beach Station-Parrys Corner-Light House-ECR" },
  { slNo: 45, routeNo: "6H", vehicleNo: "AQ7467", driverName: "MANI", phoneNumber: "9962154662", rawText: "Mint bharath theatre-(Via)-Pencil factory-Mint Metro-Stanli-Bharathi Arts college-Broadway theatre-Mannadi metro-High court-Light house-ECR" },
  { slNo: 46, routeNo: "6(I)", vehicleNo: "A2040", driverName: "KUMAR", phoneNumber: "8124479537", rawText: "Vimco Nagar-(Via)- Thiruvotriyur-Theradi- Tondiarpet – Kalra Hospital-Kasimedu- Kalmandabam-Royapuram-Light house-Santhome-Pattinambakkam-ECR" },
  { slNo: 47, routeNo: "7", vehicleNo: "AQ9771", driverName: "SELVAKUMAR", phoneNumber: "9600127817", rawText: "Maathur-(Via)-Madhavaram Post Office- Moolakadai–Sharma Nagar-Vyasarpadi-Walltax Road- Central- Anna Square-Vivekanandar illam" },
  { slNo: 48, routeNo: "7A", vehicleNo: "AU3759", driverName: "MURUGARAJ", phoneNumber: "8973379686", rawText: "Madhavaram –(Via)-Moolakadai-Sharma Nagar-Vyasarpadi- Basin bridge-Nehru Stadium-Central-Pattinambakkam-Santhome-Adyar" },
  { slNo: 49, routeNo: "7B", vehicleNo: "AU3471", driverName: "DURAIVEL", phoneNumber: "7010356171", rawText: "Madhavaram M.R Nagar-(Via)-M.K.B Nagar -Vysarpadi- Wall tax Road-Central-Light House- Santhome-Pattinambakkam-Adyar" },
  { slNo: 50, routeNo: "7C", vehicleNo: "AU3237", driverName: "SYED", phoneNumber: "8680951189", rawText: "Madhavaram M.R Nagar-(Via)-M.K.BNagar –EB-Vyasarpadi- Basin bridge-Nehru Stadium-Central-Pattinambakkam-Santhome-Adyar" },
  { slNo: 51, routeNo: "8", vehicleNo: "AF1788", driverName: "PALANI", phoneNumber: "8681999983", rawText: "Valluvarkottam-(via)- Semmozhi Poonga-Stella Marrys College- Luz Corner- Mylapore- Mandaveli-Sathya Studio- Adyar-ECR" },
  { slNo: 52, routeNo: "8A", vehicleNo: "AD8790", driverName: "KAJA MOIHEEN", phoneNumber: "8754448206", rawText: "City Centre-(Via)-Mylapore-Mandaveli-Sathya studio-Adyar-Thiruvanmiyur-Palavakkam-Kottivakkam-V.G.P-ECR" },
  { slNo: 53, routeNo: "8C", vehicleNo: "AK6477", driverName: "MANIKANDAN", phoneNumber: "9551425458", rawText: "Ameer Mahal-(via)- Russian Emforce–Ajantha- Royapetah-Santhome- Pattinambakkam-Sathya studio-Adyar-ECR" },
  { slNo: 54, routeNo: "8D", vehicleNo: "AK7071", driverName: "RANJITH", phoneNumber: "8056131336", rawText: "Mandaveli-(Via)-Mylapore-Sathya Studio- Adyar Malar Hospital-AdyarDepot-Thiruvanmiyur-Palavakkam-Neelankarai-V.G.P-ECR" },
  { slNo: 55, routeNo: "8E", vehicleNo: "AQ9474", driverName: "SENTHIL", phoneNumber: "9003129324", rawText: "Triplecane-(Via)-Annapoonra-Ice house-Vivekanandar Illam-Light House-Santhome-Pattinambakkam-Adyar-Thiruvanmiyur-Palavakkam-ECR" },
  { slNo: 56, routeNo: "8F", vehicleNo: "AB8178", driverName: "VINOTH", phoneNumber: "9514500129", rawText: "Light House-(Via)-Santhome-Pattinambakkam-MRC Nagar-Sathya studio-Adyar-ECR" },
  { slNo: 57, routeNo: "8G", vehicleNo: "J1266", driverName: "BALAMURUGAN", phoneNumber: "9789075220", rawText: "Light House-(Via)-Santhome-Pattinambakkam-MRC Nagar-Sathya studio-Thiruvanmiyur-Kottivakkam-V.G.P-ECR" },
  { slNo: 58, routeNo: "8H", vehicleNo: "AD7197", driverName: "MURALI", phoneNumber: "7358251352", rawText: "Egmore-(Via)-Chintharipet-Triplecane-Annapoonra-Ice house-Vivekanandar Illam-Light House-Santhome-ECR" },
  { slNo: 59, routeNo: "9", vehicleNo: "Z4110", driverName: "J.D.RAJA", phoneNumber: "9941113402", rawText: "Besant Nagar-(via)- Vannathurai–Thiruvanmiyur-Palavakkam-V.G.P" },
  { slNo: 60, routeNo: "9A", vehicleNo: "AZ6099", driverName: "K.SUBRAMANIAN", phoneNumber: "9489249935", rawText: "Adyar Telephone Exchange-(Via)-Thiruvanmiyur-Kottivakkam-V.G.P" },
  { slNo: 61, routeNo: "9B", vehicleNo: "AC5595", driverName: "N.V.RAJEEVAN", phoneNumber: "9884765797", rawText: "Thiruvanmiyur-(via)- Palavakkam-Neelankarai-Kottivakkam-V.G.P-ECR" },
  { slNo: 62, routeNo: "9C", vehicleNo: "AA8070", driverName: "P.SENTHIL", phoneNumber: "9551639973", rawText: "Thiruvanmiyur-(via)-Palavakkam-Neelankarai-Kottivakkam-V.G.P-ECR" },
  { slNo: 63, routeNo: "9D", vehicleNo: "AB8979", driverName: "SANTHAKUMAR", phoneNumber: "7397327907", rawText: "Thiruvanmiyur-(via)-Palavakkam-Neelankarai-Kottivakkam-V.G.P-ECR" },
  { slNo: 64, routeNo: "9E", vehicleNo: "BW9987", driverName: "AROKIADASS", phoneNumber: "9444426238", rawText: "Vettuvankeni-(Via)-Injambakkam-V.G.P-Akkarai-ECR" },
  { slNo: 65, routeNo: "10", vehicleNo: "AQ7278", driverName: "PAWAN KUMAR", phoneNumber: "8807695465", rawText: "Thiruvallur-(via)- Manavalan Nagar –Poonamallee-Kumananchavadi- Ayyapanthangal-Ramapuram–Butt Road-Guindy" },
  { slNo: 66, routeNo: "10A", vehicleNo: "A2004", driverName: "SAMBHASIVAM", phoneNumber: "9123526544", rawText: "Thiruvallur-(via)- Manavalan Nagar –Poonamallee-Kumananchavadi- Ayyapanthangal-Ramapuram–Butt Road-Guindy" },
  { slNo: 67, routeNo: "10B", vehicleNo: "AD7476", driverName: "BHAKTHAVASAL M", phoneNumber: "8939101104", rawText: "Poonamallee-(via)-Ayyapanthangal–Karayanchavadi-Porur Signal- Mugalivakkam-Ramapuram- Butt Road-Guindy-Velacherry bye pass-Chennai one" },
  { slNo: 68, routeNo: "10C", vehicleNo: "AM7674", driverName: "THIYAGU", phoneNumber: "7397327907", rawText: "Poonamallee-(via)- Ayyapanthangal–Karayanchavadi- Porur Signal-Mugalivakkam- Ramapuram- Butt Road-Guindy-Velacherry bye pass" },
  { slNo: 69, routeNo: "10D", vehicleNo: "AF2571", driverName: "FRANCIS", phoneNumber: "9841104999", rawText: "Poonamallee-(via)- Ayyapanthangal–Karayanchavadi- Porur Signal-Mugalivakkam- Ramapuram- Butt Road-Guindy-Velacherry bye pass" },
  { slNo: 70, routeNo: "10E", vehicleNo: "AD7278", driverName: "SHOBAN", phoneNumber: "9087658389", rawText: "Porur Bai kadai- (Via)-Porur signal-Mugalivakkam- Ramapuram- Butt Road-Guindy-Velacherry bye pass-Vijaya Nagar-Tansi Nagar" },
  { slNo: 71, routeNo: "10F", vehicleNo: "A3111", driverName: "RAVIKUMAR", phoneNumber: "8667301987", rawText: "Poonamallee-(via)- Ayyapanthangal–Karayanchavadi- Porur Signal-Mugalivakkam- Ramapuram- Butt Road-Guindy-Velacherry bye pass" },
  { slNo: 72, routeNo: "11", vehicleNo: "AF2274", driverName: "R.GOPI", phoneNumber: "9943778015", rawText: "Veppampattu-(Via)-Thirunindravur-Jaya college-Nemilicherry bye pass-Vandalore-Kandigai-Melakottaiyur" },
  { slNo: 73, routeNo: "11A", vehicleNo: "AQ9717", driverName: "A.SARAVANAN", phoneNumber: "7871368888", rawText: "Thirunindravur-(via)-Pattabiram-Avadi check post-Sennarikuppam-TVS bye pass-Vandalore-Kolabakkam-Kelakottaiyur-Mambakkam" },
  { slNo: 74, routeNo: "11B", vehicleNo: "AU3579", driverName: "RAJI", phoneNumber: "6383249235", rawText: "Avadi-(via)- Avadi Murugappa Polytechnic Thirumullaivoyal- Ambattur O.T- Ambattur- Padi- Koyambedu-MMDA-Vadapalani-Alandur metro" },
  { slNo: 75, routeNo: "11C", vehicleNo: "AF1977", driverName: "N.GOPAL", phoneNumber: "9080221856", rawText: "Ayapakkam-(Via)-Mugapair West-J.J Nagar Police Station- Collector Nagar–Thirumangalam-Koyambedu-Vadapalani-Ekattuthangal-Alandur metro" },
  { slNo: 76, routeNo: "11D", vehicleNo: "AF1887", driverName: "ROBINSON", phoneNumber: "9566228166", rawText: "Muthapudupet–(via)-Ambattur O.T–Vavin- Collector Nagar-Thirumangalam- Koyambedu-Vadapalani-Alandur Metro-Thillai ganga nagar subway" },
  { slNo: 77, routeNo: "11E", vehicleNo: "AF1797", driverName: "L.RAMESH", phoneNumber: "9444472182", rawText: "Mugapair East-(Via)- MMM Hospital-Thirumangalam-Koyambedu-MMDA-Vadapalani-Ashok Nagar-Ekkatuthangal" },
  { slNo: 78, routeNo: "11F", vehicleNo: "AQ7197", driverName: "VISHAL", phoneNumber: "8220648490", rawText: "Sennarikuppam-(Via)-ACS College-Vanagaram-Vellappanchavadi-Maduravoyul-Nerkundram-Koyambedu-Vadapalani" },
  { slNo: 79, routeNo: "11G", vehicleNo: "A3300", driverName: "SEKAR", phoneNumber: "9791569118", rawText: "Ambattur- (Via)-Mugapair west-Collector Nagar-Thirumangalam-Koyambedu- Vadapalani-Ashok Pillar-Guindy- Alandur metro" },
  { slNo: 80, routeNo: "11H", vehicleNo: "AQ7359", driverName: "MUTHU", phoneNumber: "9841568564", rawText: "Pudur-(Via)-Ambattur-Padi-Thirumangalam-Koyambedu- MMDA-Vadapalani-Ashok pillar-Alandur metro" },
  { slNo: 81, routeNo: "11(I)", vehicleNo: "AQ7476", driverName: "MURALI", phoneNumber: "7449283990", rawText: "Pattabiram-(Via)-Avadi checkpost-Paruthipattu-Sennarikuppam-ACS College- Vanagaram-Vellappanchavadi-Maduravoyul-Nerkundram-Koyambedu-Vadapalani" },
  { slNo: 82, routeNo: "11J", vehicleNo: "AF2679", driverName: "SUBURAJ", phoneNumber: "9710803669", rawText: "Koyambedu (Via)-MMDA-Vadapalani-Ashok Nagar-Udhayam-Ekkatuthangal-Guindy-Alandur" },
  { slNo: 83, routeNo: "11K", vehicleNo: "AU3732", driverName: "PRABIN", phoneNumber: "7598888871", rawText: "Koyambedu (Via)-MMDA-Vadapalani-Ashok Nagar-Udhayam-Ekkatuthangal-Guindy-Alandur" },
  { slNo: 84, routeNo: "12", vehicleNo: "A2112", driverName: "VENKATESAN", phoneNumber: "9952934201", rawText: "Red Hills-(via)- Puzhal – Camp-Rettari-Padi-Thirumangalam-Koyambedu-Vadapalani-Alandur metro" },
  { slNo: 85, routeNo: "12A", vehicleNo: "AU3273", driverName: "MYDEEN", phoneNumber: "9677211484", rawText: "Moogambigai Theater –(Via)-Kolathur- Periyar Nagar –Paravalur- Anna Statue- Jamalaya-Binny mills-Otteri-Egmore-Spencer" },
  { slNo: 86, routeNo: "12B", vehicleNo: "AM6297", driverName: "GOPI", phoneNumber: "9940786717", rawText: "Rettari-(Via)-Anna Salai market-Agaram-Venus-Perambur Bus stand-Bhuvaneshwari-G3 Police station" },
  { slNo: 87, routeNo: "12C", vehicleNo: "AU2976", driverName: "KANISHIYA", phoneNumber: "8124170066", rawText: "Moolakadai-(Via)-Perambur Railway Station –Perambur Bus Stand- Aaduthotti- G3 Police Station –Purasaivakkam-Egmore" },
  { slNo: 88, routeNo: "12D", vehicleNo: "AU3075", driverName: "ARUNKUMAR", phoneNumber: "8778636394", rawText: "Rettari-(Via)-Kolathur-Jamalaya-G3 Police station-Puliyanthoppu-Veppery-Central-Spencer plaza-DMS-Teynampet-Kotturpuram" },
  { slNo: 89, routeNo: "12E", vehicleNo: "AU3057", driverName: "SUNDARAJ", phoneNumber: "9952001181", rawText: "Rettari-(Via)-Kolathur-Paravalur-Perambur Railway station-Otteri-Purasaiwakkam- Egmore-Ethiraj" },
  { slNo: 90, routeNo: "12F", vehicleNo: "AK6747", driverName: "GNANAVEL", phoneNumber: "9941782235", rawText: "Rettari-(Via)-Kolathur-Paravalur-Perambur Railway station-Otteri-Purasaiwakkam- Egmore-Ethiraj" },
  { slNo: 91, routeNo: "13", vehicleNo: "AU3372", driverName: "ABDUL", phoneNumber: "8778247166", rawText: "Villivakkam-(via)- Nadamuni Theatre-ICF-Ayanavaram-Kilpauk Hospital-Noor Hotel –Kellys - Purasaivakkan- Egmore" },
  { slNo: 92, routeNo: "13A", vehicleNo: "BX7998", driverName: "SARAVANAN", phoneNumber: "9789976593", rawText: "Villivakkam-(via)- Nadamuni Theatre- ICF-Ayanavaram-Noor Hotel –Kellys - Purasaivakkam-Egmore-Greams road-Gemini" },
  { slNo: 93, routeNo: "13B", vehicleNo: "AQ7377", driverName: "SEKAR", phoneNumber: "9159923848", rawText: "Villivakkam -(via)- Nadamuni Theatre-ICF-Ayanavaram-Kilpauk Hospital-Noor Hotel-Purasaivakkam-Egmore" },
  { slNo: 94, routeNo: "13D", vehicleNo: "AB6387", driverName: "KARUNA", phoneNumber: "9003271895", rawText: "Purasaivakkam-(Via)-Egmore-Spencer-Gemini-DMS-Teynampet-Kotturpuram-Madhyakailash-OMR" },
  { slNo: 95, routeNo: "14", vehicleNo: "AD7377", driverName: "THIRISANGU", phoneNumber: "9524386938", rawText: "Kodambakkam Power House-(via)-B.B.C-Kodambakkam Meenakshi College- T.Nagar Bus Stand- CIT Nagar - Saidapet-Little mount-IIT" },
  { slNo: 96, routeNo: "14A", vehicleNo: "AU3417", driverName: "JEELANI", phoneNumber: "9444585349", rawText: "T.Nagar Bus stand-(Via)-Saidapet-Little Mount-Anna University-IIT-Madhyakailash-Tidel Park-SRP Tools-Kandhanchavadi" },
  { slNo: 97, routeNo: "14B", vehicleNo: "BZ2868", driverName: "GANESAN", phoneNumber: "9884920529", rawText: "Saidapet-(Via)-Little mount-Velacherry Bye pass-Vijayanagar-Baby nagar-Taramani-Perungudi-PTC-Karapakkam" },
  { slNo: 98, routeNo: "15", vehicleNo: "AD7071", driverName: "DINESH", phoneNumber: "7305922062", rawText: "Chinmaya Nagar-(via)-Virugambakkam- Avichi School –Pondicherry guest house-K.K.Nagar-Meetupalayam – Seenuvasa Theatre-Kannamapettai- CIT Nagar- Saidapet" },
  { slNo: 99, routeNo: "15A", vehicleNo: "AU2967", driverName: "SANKAR", phoneNumber: "9677276317", rawText: "Chinmaya Nagar-(via)-Virugambakkam- Avichi School –Pondicherry guest house-K.K.Nagar-Meetupalayam – Seenuvasa Theatre-Kannamapettai- CIT Nagar- Saidapet" },
  { slNo: 100, routeNo: "15B", vehicleNo: "AS3219", driverName: "HARI", phoneNumber: "9551200768", rawText: "Saligramam-(via)- AVM Signal -West Mambalam- Brindavanam Street- - Duraisamy Sub Way -Panagal Park - Nandanam Signal" },
  { slNo: 101, routeNo: "15C", vehicleNo: "AQ9762", driverName: "STALIN", phoneNumber: "9791583931", rawText: "7th Avenue Sangam Hotel-(via)-Blue Tank-Ekkatuthangal-Velacherry Bye Pass-Vijayanagar-Chennai One" },
  { slNo: 102, routeNo: "16", vehicleNo: "A2022", driverName: "S.RAJENDRAN", phoneNumber: "9841294269", rawText: "Senthil Nagar-(Via)-K 4 Police Station- Chinthamani –Kilpauk garden-Kilpauk Ega theatre-Chetpet- Gemini-Kalaignar TV Teynampet- SIET- Kotturpuram" },
  { slNo: 103, routeNo: "16A", vehicleNo: "AF2337", driverName: "MATHIMARAN", phoneNumber: "7871348902", rawText: "Manali-(via)- Madhavaram Rountana-Senthil nagar-Blue Star-Anna Nagar Rountana- Shanthi Colony- Anna Arch - Choolaimedu -Metha Nagar- Loyala College" },
  { slNo: 104, routeNo: "16B", vehicleNo: "AM6117", driverName: "SIVASHANKAR", phoneNumber: "9840372067", rawText: "Anna nagar west depot-(Via)-Shanthi Colony-Anna arch-Metha Nagar- Choolaimedu-LoyalaCollegeNungambakkam-Gemini-DMS-Kalaignartv" },
  { slNo: 105, routeNo: "16C", vehicleNo: "AC5757", driverName: "GURUVAREDDY", phoneNumber: "7338716800", rawText: "Temple school-(Via)-Senthil Nagar-Thathankuppam-Anna Arch- Metha Nagar-Choolaimedu- Loyala College-Nungambakkam-Gemini-DMS-Kalaignar tv-Teynampet-Kotturpuram-IIT-Madhyakailash" },
  { slNo: 106, routeNo: "16D", vehicleNo: "AK6576", driverName: "RAJA", phoneNumber: "8072826860", rawText: "Korattur-(via)- TVS – Lucas- Anna Nagar West Depo- Anna Arch-Choolaimedu- Metha Nagar -Loyala College-Nungambakkam-Gemini-DMS-Teynampet-Kotturpuram" },
  { slNo: 107, routeNo: "16E", vehicleNo: "AQ7647", driverName: "UDHAYAKUMAR", phoneNumber: "9003623284", rawText: "Anna Arch-(Via)-Choolaimedu- Metha Nagar -Loyala College-Nungambakkam-Gemini-DMS-Teynampet-Kotturpuram-Madhyakailash-Tidel Park-Perungudi" },
  { slNo: 108, routeNo: "17", vehicleNo: "AK9897", driverName: "VIGNESH", phoneNumber: "9363577543", rawText: "Porur-(via)- Lakshmi Nagar –Valasaravakkam- Alwarthiru Nagar- Kesavarthini-Virugambakkam-Guindy-Velacherry bye pass-Chennai One" },
  { slNo: 109, routeNo: "17A", vehicleNo: "AK7179", driverName: "KANNAN", phoneNumber: "9344531159", rawText: "Porur-(via)- Karampakkam-Lakshmi Nagar –Valasaravakkam-Kesavarthini-Alwarthiru Nagar--Guindy- Velacherry Bye Pass" },
  { slNo: 110, routeNo: "17B", vehicleNo: "AF1878", driverName: "SIVASANKAR", phoneNumber: "9841566676", rawText: "K.K.Nagar-(via)- Pondicherry Guest House –Udayam- Kasi–Guindy-Velacherry Bye Pass- Velacherry Railway station -Kaiveli" },
  { slNo: 111, routeNo: "18", vehicleNo: "AQ9177", driverName: "LENIN", phoneNumber: "9500198814", rawText: "Mangadu-(via)-Kundrathur-Anakapudur-Pammal-Pallavaram-Vels college-S.Kolathur-Kamakshi Hospital-Chennai one" },
  { slNo: 112, routeNo: "18A", vehicleNo: "AK6783", driverName: "IKRAM", phoneNumber: "9790971199", rawText: "Kundrathur-(via)-Anakaputhur-Pammal-Pallavaram- Vels college-S.Kolathur-Kamakshi Hospital-Chennai one" },
  { slNo: 113, routeNo: "18B", vehicleNo: "AD6675", driverName: "MURUGAN", phoneNumber: "8220232691", rawText: "Kundrathur-(via)-Anakaputhur-Pammal-Pallavaram- Vels college-S.Kolathur-Kamakshi Hospital-Chennai one" },
  { slNo: 114, routeNo: "18C", vehicleNo: "AK7476", driverName: "PRAKASH", phoneNumber: "9840364110", rawText: "Pallavaram Vels College-(Via)-Echankadu Signal – S.kolathur-Kamakshi Hospital-Chennai one" },
  { slNo: 115, routeNo: "18D", vehicleNo: "BX8385", driverName: "K.NAGARAJAN", phoneNumber: "9003151326", rawText: "Meenambakkam-(Via)-Pallavaram-Chrompet-Sanitorium-Tambaram-West Depot-Camproad-Mahalakshmi Nagar" },
  { slNo: 116, routeNo: "18E", vehicleNo: "AU3687", driverName: "PALANI", phoneNumber: "9043081709", rawText: "Pammal-(Via)- Pallavaram-Chrompet-Sanitorium-Tambaram-Camproad-Sembakkam-Gowrivakkam-Medavakkam Koot Road - Sithalabakkam" },
  { slNo: 117, routeNo: "18F", vehicleNo: "AC5775", driverName: "SATHISH", phoneNumber: "7418855515", rawText: "Kundrathur-(via)-Anakaputhur-Pammal-Pallavaram- Vels college-S.Kolathur-Kamakshi Hospital-Chennai one" },
  { slNo: 118, routeNo: "19", vehicleNo: "AU3597", driverName: "RAMESH", phoneNumber: "9677515538", rawText: "Walajabath- (Via)-Oragadam-Padapai-Salamangalam-Mannivakkam- Mudichur-Tambaram" },
  { slNo: 119, routeNo: "19A", vehicleNo: "BX7989", driverName: "DEVANESAN", phoneNumber: "9840043412", rawText: "Mudichur -(Via)-Old Perungulathore –Bharathi Nagar-Tambaram-Selaiyur-Camproad-Mahalakshmi Nagar-Sembakkam-" },
  { slNo: 120, routeNo: "19B", vehicleNo: "A1617", driverName: "JAMES", phoneNumber: "9894387985", rawText: "Manimangalam-(Via)-Mudichur - Old Perungulathore –Bharathi Nagar-Tambaram-Selaiyur-Camproad-Mahalakshmi Nagar-Sembakkam-Santhoshpuram" },
  { slNo: 121, routeNo: "19C", vehicleNo: "AK6738", driverName: "RANJITH", phoneNumber: "9790039246", rawText: "Mudichur-(Via)-Gandhi Nagar-Tambaram-Selaiyur-Camproad-Kamarajapuram-Sithalabakkam" },
  { slNo: 122, routeNo: "20", vehicleNo: "AD8997", driverName: "RAVI", phoneNumber: "9788028002", rawText: "Hasthinapuram -(Via)-Chitlapakkam- Selaiyur Police Station-Camproad- Mahalakshmi Nagar-Rajakilpakkam-Kamarajapuram" },
  { slNo: 123, routeNo: "20A", vehicleNo: "AZ6189", driverName: "DHASS", phoneNumber: "9789022437", rawText: "Hasthinapuram-(via)-Chitlapakkam-Poondi Bazar-Selaiyur-Camproad-Sembakkam-Santhoshpuram-Medavakkam" },
  { slNo: 124, routeNo: "20B", vehicleNo: "Z3633", driverName: "RAMESH", phoneNumber: "8838695590", rawText: "Kamarajapuram-(Via)-Santhospuram-Medavakkam Koot Road-Medavakkam-Perumbakkam-Global-HCL" },
  { slNo: 125, routeNo: "21", vehicleNo: "AU3795", driverName: "GNANAGURU", phoneNumber: "7708796143", rawText: "Mannivakkam-(Via)-Lakshmi nagar-Mudichur -Old Perungulathore –Bharathi Nagar-Tambaram-Selaiyur-Camproad-Mahalakshmi Nagar-Sembakkam" },
  { slNo: 126, routeNo: "21A", vehicleNo: "AS7926", driverName: "PERIYASAMY", phoneNumber: "8220370275", rawText: "Vandalore-(Via)-Perungulathore-Irumpuliyur-Tambaram-Selaiyur-Camproad-Kamarajapuram" },
  { slNo: 127, routeNo: "21B", vehicleNo: "BX8088", driverName: "KRISHNAMOORTHY", phoneNumber: "8248270395", rawText: "Vandalore-(Via)-Perungulathore-Irumpuliyur-Tambaram-Selaiyur-Camproad-Kamarajapuram" },
  { slNo: 128, routeNo: "21C", vehicleNo: "AK7080", driverName: "VINOTH", phoneNumber: "8760523746", rawText: "Camproad-(Via)-Sembakkam-Kamarajapuram-Medavakkam Koot Road-Sithalabakkam" },
  { slNo: 129, routeNo: "22", vehicleNo: "BX8070", driverName: "SELVARAJ", phoneNumber: "9884164237", rawText: "Kamakshi Hospital-(Via)-Balaji Dental College- Narayanapuram-Pallikaranai-Medavakkam-Perumbakkam-Global-HCL" },
  { slNo: 130, routeNo: "22A", vehicleNo: "Z4200", driverName: "PRASANTH", phoneNumber: "9094884331", rawText: "Kamakshi Hospital-(Via)-Balaji Dental College- Narayanapuram-Pallikaranai-Medavakkam-Perumbakkam-Global-HCL" },
  { slNo: 131, routeNo: "22B", vehicleNo: "AK9789", driverName: "RAMACHANDRAN", phoneNumber: "9884040339", rawText: "Kamakshi Hospital-(Via)-Balaji Dental College- Narayanapuram-Pallikaranai-Medavakkam-Perumbakkam-Global-HCL" },
  { slNo: 132, routeNo: "22C", vehicleNo: "AU9969", driverName: "VIJAYKUMAR", phoneNumber: "9710576748", rawText: "Medavakkam-(Via)-Perumbakkam Church–Global-HCL" },
  { slNo: 133, routeNo: "22D", vehicleNo: "CY6369", driverName: "KARUPPU", phoneNumber: "7845207790", rawText: "Vengaivasal-(Via)-IM Gear Company- New Prince College -Santhoshpuram-MedavakkamKoot Road-Medavakkam-Perumbakkam" },
  { slNo: 134, routeNo: "23", vehicleNo: "A1500", driverName: "ARJUN", phoneNumber: "9952720962", rawText: "Axis Bank-(via)-Madipakkam Ponniyamman temple-Balaya Gardan-Sadasivam Nagar-Ram Nagar-Kaiveli-Chennai One" },
  { slNo: 135, routeNo: "23A", vehicleNo: "BZ2040", driverName: "SIVALINGAM", phoneNumber: "7401277511", rawText: "Axis Bank-(via)-Madipakkam Ponniyamman temple-Balaya Gardan-Sadasivam Nagar-Ram Nagar-Kaiveli-Chennai One" },
  { slNo: 136, routeNo: "24", vehicleNo: "AT5559", driverName: "T.KUMAR", phoneNumber: "9840720275", rawText: "Ross Nagar-(Via)-Nun Mangalam-Mothersa textiles-Vellakal-Anjaneyar Temple-Kovilambakkam-MedavakkamKoot Road-Babu Nagar-Veerapathira Nagar-Sithalabakkam" },
  { slNo: 137, routeNo: "24A", vehicleNo: "CY6090", driverName: "RAMESH", phoneNumber: "8531933158", rawText: "Echankadu Signal-(Via)-Ross Nagar-Nun Mangalam- Mothersa textiles-Vellakal-Anjaneyar Temple-Kovilambakkam-MedavakkamKoot Road-Babu Nagar-Veerapathira Nagar" },
  { slNo: 138, routeNo: "24B", vehicleNo: "AS7926", driverName: "JAYAKANTH", phoneNumber: "9786308121", rawText: "Puthukovil-(Via)-Medavakkam Koot Road-Babu Nagar-Veerabathira nagar-Sithalabakkam" },
  { slNo: 139, routeNo: "25", vehicleNo: "AM6072", driverName: "RAJENDRAN", phoneNumber: "9791100217", rawText: "Axis Bank-(via)- Keelkattalai–Ganesh Nagar- S.kolathur-KamakshiHospital-Chennai one-PTC-Karapakkam" },
  { slNo: 140, routeNo: "25A", vehicleNo: "AS7917", driverName: "VENKATESAN", phoneNumber: "8438994984", rawText: "Pallavaram Vels college-(Via)-Echankadu signal-S.kolathur-Kamakshi Hospital-Chennai One-Thoraipakkam-PTC-Karapakkam" },
  { slNo: 141, routeNo: "26", vehicleNo: "AU3174", driverName: "GOVINDAN", phoneNumber: "9884792307", rawText: "Movarasanpet kolam-(Via)-J.K.Mahal-Nanganallur park-Poorvika-Vanuvampettai church-Velacherry Railway Station-Kaiveli-Chennai One" },
  { slNo: 142, routeNo: "26A", vehicleNo: "BW0969", driverName: "SUBRAMANI", phoneNumber: "8122999434", rawText: "Pazhavanthangal Subway-(Via)-Canara bank- Poorvika-pillayar temple-Anjaneyar temple-Vanuvampettai church-Pulithivakkam police booth-Kaiveli" },
  { slNo: 143, routeNo: "26B", vehicleNo: "BW9690", driverName: "ELUMALAI", phoneNumber: "6374127297", rawText: "Nangnallur Sub Way-(via)-Vanuvanpettai Church-Velacherry Railway Station-Kaiveli-Chennai One" },
  { slNo: 144, routeNo: "27", vehicleNo: "BX7773", driverName: "YESURATHINAM", phoneNumber: "7397485266", rawText: "Tambaram MCC College-(Via)-Selaiyur-Camproad-Sembakkam-Kamarajapuram-Santoshpuram" },
  { slNo: 145, routeNo: "27A", vehicleNo: "AQ9672", driverName: "GOVINDASAMY", phoneNumber: "9710485878", rawText: "Indra Nagar-(Via)- Bharath University- Lakshmi ammal college-Mappedu-Agaramthen-Kovilancherry erikarai-Sithalabakkam" },
  { slNo: 146, routeNo: "27B", vehicleNo: "AM7476", driverName: "C.SENTHIL", phoneNumber: "7299775338", rawText: "Bharath University-(Via)-Ruby apartments-Lakshmi ammal college-Mappedu-Agaramthen-Kovilancherry erikarai-Sithalabakkam" },
  { slNo: 147, routeNo: "28", vehicleNo: "AA7800", driverName: "A.RAVI", phoneNumber: "9444738252", rawText: "Rajakilpakkam -(via)-Sudarsan Nagar-Maruthi Nagar- Kozhi Pannai-Madambakkam sivan temple-Sithalabakkam Koot road-Sithalabakkam" },
  { slNo: 148, routeNo: "28A", vehicleNo: "AS7935", driverName: "KUMARESAN", phoneNumber: "9962960477", rawText: "Bharath University-(Via)-Padmavathy nagar-ALS Nagar-Madambakkam-Rajakilpakkam-Veerapathiranagar-Sowmiyanagar-Navins apartment" },
  { slNo: 149, routeNo: "29", vehicleNo: "BX8700", driverName: "P.MUTHU", phoneNumber: "9710702355", rawText: "Arasankazhani Signal(Via)-Ottiyambakkam-Kaaranai-Nest apartment" },
  { slNo: 150, routeNo: "29A", vehicleNo: "Z4020", driverName: "ETHIRAJ", phoneNumber: "9380546743", rawText: "Veerapathira Nagar-(Via)-Sowmiyanagar-Sithalabakkam Koot Road-Sithalabakkam-Ottiyambakkam-Kaaranai-DLF" },
  { slNo: 151, routeNo: "30", vehicleNo: "BZ2112", driverName: "ARUMUGAM", phoneNumber: "9042687790", rawText: "N.G.O Colony–(via)-Brindavan Nagar-Velacherry Railway Station –Kaiveli Signal-Thuraipakkam-PTC" },
  { slNo: 152, routeNo: "30A", vehicleNo: "AS3363", driverName: "PADMANABAN", phoneNumber: "9884176893", rawText: "N.G.O Colony–(via)-Brindavan Nagar-Velacherry Railway Station –Kaiveli Signal-Thuraipakkam-PTC" },
  { slNo: 153, routeNo: "32", vehicleNo: "BZ2400", driverName: "A.V.RAMESH", phoneNumber: "7010351581", rawText: "Velacherry Gurunanak college-(Via)-GRT-VijayaNagar-BabyNagar -TansiNagar- Taramani- Perungudi-Jain College- Mettukuppam" },
  { slNo: 154, routeNo: "32A", vehicleNo: "CY6585", driverName: "MOHANRAJ", phoneNumber: "8248682285", rawText: "Velacherry bus stand-(Via)-Velacherry Tansi Nagar Baby Nagar –Pillayar kovil-Taramani-Perungudi- Jain College-Mettukuppam" },
  { slNo: 155, routeNo: "32B", vehicleNo: "AZ6090", driverName: "MANIKANDAN", phoneNumber: "9791029979", rawText: "Velacherry Baby Nagar–(Via)-Pillayarkovil-Taramani-Perungudi-JainCollege-Mettukuppam-Karapakkam" },
  { slNo: 156, routeNo: "32C", vehicleNo: "Z4443", driverName: "BALAKRISHNAN", phoneNumber: "6382670679", rawText: "Kandhanchavadi-(Via)-Perungudi-Thoraipakkam-Jain College-Mettukuppam-Karapakkam-Dollar" },
  { slNo: 157, routeNo: "33", vehicleNo: "AB8817", driverName: "MANOJ", phoneNumber: "9566359326", rawText: "Taramani-(Via)-PerungudiToll Gate- Thoraipakkam- Jain College - Mettukuppam PTC" },
  { slNo: 158, routeNo: "33A", vehicleNo: "AE9996", driverName: "SABARINADHAN", phoneNumber: "9344504370", rawText: "PerungudiToll Gate-(Via)-Thoraipakkam- Jain College -Mettukuppam PTC-Karapakkam" },
  { slNo: 159, routeNo: "33B", vehicleNo: "AB6297", driverName: "CHANDRAN", phoneNumber: "8270600137", rawText: "Thoraipakkam Toll gate-(Via)- Jain College - Mettukuppam PTC-Karapakkam-Dollar" },
  { slNo: 160, routeNo: "33C", vehicleNo: "Z3525", driverName: "MAHENDRAN", phoneNumber: "9042387393", rawText: "PTC-(Via)-Karapakkam-Dollar-Sholinganallur-Aavin-Ponniyamman temple-HP Petrol bunk" },
  { slNo: 161, routeNo: "33D", vehicleNo: "AE9969", driverName: "MANIKANDAN", phoneNumber: "9789355097", rawText: "Thoraipakkam Toll gate-(Via)- Jain College - Mettukuppam PTC-Karapakkam-Dollar" },
  { slNo: 162, routeNo: "33E", vehicleNo: "H6036", driverName: "KANNAN", phoneNumber: "8807249205", rawText: "PTC-(Via)-Karapakkam-Dollar-Sholinganallur-Aavin-Ponniyamman temple-HP Petrol bunk" },
  { slNo: 163, routeNo: "33F", vehicleNo: "BW7575", driverName: "PERIYASAMY", phoneNumber: "7305048936", rawText: "PTC-(Via)-Karapakkam-Dollar-Sholinganallur-Aavin-Ponniyamman temple-HP Petrol bunk" },
  { slNo: 164, routeNo: "33G", vehicleNo: "Z3219", driverName: "GANESH", phoneNumber: "9789973917", rawText: "Karapakkam-(Via)-Dollar-Sholinganallur-Aavin-Ponniyamman temple-HP Petrol bunk" },
  { slNo: 165, routeNo: "34A", vehicleNo: "CY6234", driverName: "JAISHANKAR", phoneNumber: "9962919665", rawText: "SholinganallurECR Toll gate-(Via)-Ponniyamman Temple-HP Petrol" },
  { slNo: 166, routeNo: "34B", vehicleNo: "AM6279", driverName: "RAMESH", phoneNumber: "9443922365", rawText: "Sholinganallur ECR Toll gate-(Via)-Ponniyamman Temple-HP Petrol" },
  { slNo: 167, routeNo: "35", vehicleNo: "Z4011", driverName: "PERUMAL", phoneNumber: "7448882373", rawText: "Pudubakkam-(via) –Siruseri –Thalambur-Navalur – AGS-Semmencherry Alamaram" },
  { slNo: 168, routeNo: "35A", vehicleNo: "BZ2535", driverName: "MOORTHY", phoneNumber: "9962804403", rawText: "Ponmar -(via)- Thalambur – Navalur –AGS- SemmencherryAlamaram" },
  { slNo: 169, routeNo: "35B", vehicleNo: "AZ6171", driverName: "SURESHKUMAR", phoneNumber: "9025021008", rawText: "Thalambur-(Via)- Navalur – AGS-SemmencherryAlamaram" },
  { slNo: 170, routeNo: "35C", vehicleNo: "Z3363", driverName: "SANKAR", phoneNumber: "8939190540", rawText: "Sipcot Signal-(Via)-Marina mall-Navalur – AGS-SemmencherryAlamaram" },
  { slNo: 171, routeNo: "36", vehicleNo: "AA7998", driverName: "PANNEER", phoneNumber: "6382011400", rawText: "Bollini Apartment-(Via)-Nest Apartment-Kumaran Nagar" },
  { slNo: 172, routeNo: "36A", vehicleNo: "AA7710", driverName: "YESUDOSS", phoneNumber: "6379169607", rawText: "Dinesh Vihar Apartment-(Via)-DLF Garden City Apartment- Nest Apartment –Kumaran Nagar Petrol" },
  { slNo: 173, routeNo: "36B", vehicleNo: "CY6171", driverName: "SUDIR BABU", phoneNumber: "9840804018", rawText: "Perumbakkam Church-(Via)-Nookampalayamroad-Bollini Apartment-Nest Apartment" },
  { slNo: 174, routeNo: "36C", vehicleNo: "Z8997", driverName: "ELLAPPAN", phoneNumber: "9840798322", rawText: "DLF Garden City Apartment-(Via)- Nest Apartment –Kumaran Nagar Petrol" },
  { slNo: 175, routeNo: "37", vehicleNo: "AC5055", driverName: "UMAPATHY", phoneNumber: "9566164267", rawText: "Uthandi Toll gate-(Via)-Panaiyur-Akkarai-Sholinganallur-Ponniyamman temple" },
];

function determineZone(origin: string, via: string[]): SathyabamaBusRoute["zone"] {
  const combined = (origin + " " + via.join(" ")).toLowerCase();
  if (
    combined.includes("tambaram") ||
    combined.includes("selaiyur") ||
    combined.includes("camp road") ||
    combined.includes("medavakkam") ||
    combined.includes("chromepet") ||
    combined.includes("sanatorium") ||
    combined.includes("pallavaram") ||
    combined.includes("vandalur") ||
    combined.includes("vandalore") ||
    combined.includes("urapakkam") ||
    combined.includes("guduvancherry") ||
    combined.includes("mudichur") ||
    combined.includes("hasthinapuram") ||
    combined.includes("pammal")
  ) {
    return "Tambaram & GST";
  }
  if (
    combined.includes("velacherry") ||
    combined.includes("taramani") ||
    combined.includes("perungudi") ||
    combined.includes("thoraipakkam") ||
    combined.includes("karapakkam") ||
    combined.includes("sholinganallur") ||
    combined.includes("navalur") ||
    combined.includes("siruseri") ||
    combined.includes("padur") ||
    combined.includes("kelambakkam")
  ) {
    return "OMR & Velachery";
  }
  if (
    combined.includes("ecr") ||
    combined.includes("thiruvanmiyur") ||
    combined.includes("palavakkam") ||
    combined.includes("neelankarai") ||
    combined.includes("kottivakkam") ||
    combined.includes("injambakkam") ||
    combined.includes("akkarai") ||
    combined.includes("uthandi") ||
    combined.includes("kovalam") ||
    combined.includes("mahabalipuram") ||
    combined.includes("kalpakkam")
  ) {
    return "ECR Coastal";
  }
  if (
    combined.includes("porur") ||
    combined.includes("poonamallee") ||
    combined.includes("guindy") ||
    combined.includes("ramapuram") ||
    combined.includes("butt road") ||
    combined.includes("kundrathur") ||
    combined.includes("valasaravakkam") ||
    combined.includes("virugambakkam") ||
    combined.includes("mangadu")
  ) {
    return "West Chennai (Porur/Guindy)";
  }
  if (
    combined.includes("t.nagar") ||
    combined.includes("saidapet") ||
    combined.includes("adyar") ||
    combined.includes("mylapore") ||
    combined.includes("mandaveli") ||
    combined.includes("kodambakkam") ||
    combined.includes("k.k.nagar") ||
    combined.includes("saligramam") ||
    combined.includes("triplecane") ||
    combined.includes("triplicane") ||
    combined.includes("egmore") ||
    combined.includes("central")
  ) {
    return "Central Chennai";
  }
  if (
    combined.includes("koyambedu") ||
    combined.includes("ambattur") ||
    combined.includes("avadi") ||
    combined.includes("anna nagar") ||
    combined.includes("perambur") ||
    combined.includes("madhavaram") ||
    combined.includes("red hills") ||
    combined.includes("tondiarpet") ||
    combined.includes("thiruvotriyur") ||
    combined.includes("kolathur") ||
    combined.includes("villivakkam") ||
    combined.includes("royapuram")
  ) {
    return "North Chennai";
  }
  return "Outer Suburbs";
}

// Convert raw table entries into enriched structured SathyabamaBusRoute records
export const SATHYABAMA_BUS_ROUTES: SathyabamaBusRoute[] = RAW_SATHYABAMA_ROUTES.map((raw) => {
  const parts = raw.rawText.split(/-\(via\)-|-\(Via\)-/i);
  const origin = parts[0]?.trim() || "Chennai";
  const rawVia = parts[1] || "";
  const viaStops = rawVia
    .split(/[-–]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  const zone = determineZone(origin, viaStops);

  let depHour = 7;
  let depMin = 15;
  if (zone === "Outer Suburbs" || origin.includes("Kancheepuram") || origin.includes("Melmaruvathur")) {
    depHour = 6;
    depMin = 40;
  } else if (zone === "North Chennai") {
    depHour = 6;
    depMin = 55;
  } else if (zone === "Tambaram & GST") {
    depHour = 7;
    depMin = 15;
  } else if (zone === "OMR & Velachery") {
    depHour = 7;
    depMin = 40;
  }

  const formatTime = (h: number, m: number) => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h > 12 ? h - 12 : h;
    return `${pad(hour12)}:${pad(m)} ${ampm}`;
  };

  const departureTime = formatTime(depHour, depMin);
  const originCoord = resolveCoord(origin);

  const stops: SathyabamaBusStop[] = [
    {
      order: 1,
      name: `${origin} (Starting Boarding Point)`,
      time: departureTime,
      lat: originCoord.lat,
      lng: originCoord.lng,
      isOrigin: true,
    },
  ];

  let currentMin = depMin;
  let currentH = depHour;
  viaStops.forEach((stop, index) => {
    currentMin += 6;
    if (currentMin >= 60) {
      currentH += 1;
      currentMin -= 60;
    }
    const coord = resolveCoord(stop);
    stops.push({
      order: index + 2,
      name: stop,
      time: formatTime(currentH, currentMin),
      lat: coord.lat,
      lng: coord.lng,
    });
  });

  stops.push({
    order: stops.length + 1,
    name: "Sathyabama Campus Main Gate (Jeppiaar Nagar)",
    time: "08:25 AM",
    lat: CHENNAI_COORDS["Sathyabama Campus"].lat,
    lng: CHENNAI_COORDS["Sathyabama Campus"].lng,
    isDestination: true,
  });

  return {
    slNo: raw.slNo,
    routeNo: raw.routeNo,
    vehicleNo: raw.vehicleNo,
    driverName: raw.driverName,
    phoneNumber: raw.phoneNumber,
    origin,
    viaStops,
    destination: "Sathyabama Campus (Jeppiaar Nagar, OMR)",
    zone,
    departureTime,
    arrivalTime: "08:25 AM",
    campusInTime: "08:30 AM",
    stops,
  };
});

export const SATHYABAMA_CAMPUS_LOCATION = {
  name: "Sathyabama Institute of Science and Technology",
  address: "Jeppiaar Nagar, Rajiv Gandhi Salai (OMR), Chennai - 600119",
  lat: 12.8735,
  lng: 80.2212,
  campusInTime: "08:30 AM",
};
