import 'dart:convert';
import 'package:http/http.dart' as http;

class AgoraTokenService {
  // Firebase Functions URL - update this with your deployed function URL
  static const String baseUrl = 'https://us-central1-myproject-c8034.cloudfunctions.net';
  
  // For local testing with Firebase emulator
  static const String localUrl = 'http://127.0.0.1:5001/myproject-c8034/us-central1';
  
  // Set to true for local development, false for production
  static const bool useLocalEmulator = true;
  
  static String get functionUrl => useLocalEmulator ? localUrl : baseUrl;

  /// Generate Agora RTC token from Firebase Functions
  static Future<String?> generateToken({
    required String channelName,
    required int uid,
  }) async {
    try {
      final url = Uri.parse('$functionUrl/generateAgoraToken');
      final uri = url.replace(queryParameters: {
        'channelName': channelName,
        'uid': uid.toString(),
      });

      print('Requesting token from: $uri');

      final response = await http.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['token'] as String?;
      } else {
        print('Error generating token: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Exception while generating token: $e');
      return null;
    }
  }

  /// Generate a random UID for the user
  static int generateUid() {
    return DateTime.now().millisecondsSinceEpoch % 4294967295; // Max uint32
  }
}