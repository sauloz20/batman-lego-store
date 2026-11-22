<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Cache-Control: no-store');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['message' => 'Use POST.']);
}
$action = $_GET['action'] ?? '';
if (!in_array($action, ['login', 'register'], true)) {
    respond(404, ['message' => 'Rota desconhecida.']);
}
$data = json_decode(file_get_contents('php://input'), true);
$email = is_string($data['email'] ?? null) ? strtolower(trim($data['email'])) : '';
$password = $data['senha'] ?? null;
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || !is_string($password) || $password === '') {
    respond(422, ['message' => 'Informe um e-mail válido e uma senha.']);
}
try {
    $db = new PDO(getenv('BATMAN_DB_DSN') ?: 'mysql:host=127.0.0.1;dbname=batman_store;charset=utf8mb4',
        getenv('BATMAN_DB_USER') ?: 'root', getenv('BATMAN_DB_PASSWORD') ?: '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]);
    if ($action === 'register') {
        $name = is_string($data['nome'] ?? null) ? trim($data['nome']) : '';
        if ($name === '' || preg_match('/^.{1,120}$/usD', $name) !== 1 || strlen($password) < 8 || strlen($password) > 72 || strpos($password, chr(0)) !== false) {
            respond(422, ['message' => 'Informe um nome de até 120 caracteres e uma senha de 8 a 72 bytes.']);
        }
        $stmt = $db->prepare('INSERT INTO users (nome, email, password_hash) VALUES (?, ?, ?)');
        $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);
        respond(201, ['user' => ['nome' => $name, 'email' => $email]]);
    }
    $stmt = $db->prepare('SELECT nome, email, password_hash FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user || strlen($password) > 72 || strpos($password, chr(0)) !== false || !password_verify($password, $user['password_hash'])) {
        respond(401, ['message' => 'E-mail ou senha incorretos.']);
    }
    unset($user['password_hash']);
    respond(200, ['user' => $user]);
} catch (PDOException $error) {
    if (($error->errorInfo[1] ?? null) === 1062) {
        respond(409, ['message' => 'E-mail já cadastrado.']);
    }
    respond(500, ['message' => 'Serviço de contas indisponível.']);
}
