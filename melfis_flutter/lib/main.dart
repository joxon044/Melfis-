import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'models/cart.dart';
import 'screens/home_screen.dart';
import 'screens/offline_screen.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CartProvider()),
      ],
      child: const MelfisApp(),
    ),
  );
}

class MelfisApp extends StatefulWidget {
  const MelfisApp({super.key});

  @override
  State<MelfisApp> createState() => _MelfisAppState();
}

class _MelfisAppState extends State<MelfisApp> {
  bool _isOnline = true;
  late StreamSubscription<ConnectivityResult> _connectivitySubscription;

  @override
  void initState() {
    super.initState();
    _checkInitialConnectivity();
    _connectivitySubscription = Connectivity().onConnectivityChanged.listen((ConnectivityResult result) {
      setState(() {
        _isOnline = (result != ConnectivityResult.none);
      });
    });
  }

  void _checkInitialConnectivity() async {
    final result = await Connectivity().checkConnectivity();
    setState(() {
      _isOnline = (result != ConnectivityResult.none);
    });
  }

  @override
  void dispose() {
    _connectivitySubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Melfis Flower Shop',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: _isOnline
          ? const HomeScreen()
          : OfflineScreen(onRetry: _checkInitialConnectivity),
    );
  }
}

