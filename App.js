import { AUTH_API_URL } from './config/api';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert,
  Button,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { openBrowserAsync } from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────
// DADOS
// ─────────────────────────────────────────────
const products = [
  {
    id: 1,
    image:
      'https://i.pinimg.com/webp/736x/e3/44/bf/e344bf2401e1abe30f7ea760b514c439.webp',
    name: 'Batman Lego',
    price: 40.0,
    category: 'Batman',
    badge: null,
    features: ['120 peças', 'Batman clássico', 'Idade 6+', 'Linha DC'],
  },
  {
    id: 2,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX3ZeC7Nbmc7S9w7f5Iaa2R7TJu85fZYxAgg&s',
    name: 'Batman Escuro',
    price: 59.99,
    category: 'Batman',
    badge: 'Mais Vendido',
    features: ['180 peças', 'Batman Dark Knight', 'Idade 7+'],
  },
  {
    id: 3,
    image:
      'https://www.lego.com/cdn/cs/set/assets/blt2991e3e0693748f0/02_LEGO_Dinner_Hero-Tall_Mobile.jpg',
    name: 'Batmóvel Clássico',
    price: 119.2,
    category: 'Veículos',
    badge: null,
    features: ['250 peças', 'Veículo rápido', 'Alta performance'],
  },
  {
    id: 4,
    image:
      'https://i.pinimg.com/736x/97/65/24/9765245412c8b5a26049dcc0f369b382.jpg',
    name: 'Robin & Joker Set',
    price: 159.99,
    category: 'Vilões',
    badge: 'Mais Vendido',
    features: ['Set duplo', 'Herói vs vilão', 'Coleção especial'],
  },
  {
    id: 5,
    image: 'https://i.pinimg.com/736x/d1/47/01/d14701eb1e31ae1f0b259f523942a523.jpg',
    name: 'Batwing de Gotham',
    price: 249.9,
    category: 'Veículos',
    badge: null,
    features: [
      '357 peças',
      'Asas ajustáveis',
      'Atiradores de pinos',
      'Mini-figura inclusa',
    ],
  },
  {
    id: 6,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiWuUJOVwOXNTBBD7D8cEyvfl6Q-gbfqeJhQ&s',
    name: 'Asilo Arkham Breakout',
    price: 499.0,
    category: 'Vilões',
    badge: null,
    features: [
      '850 peças',
      'Celas de segurança',
      'Guarita principal',
      'Contém 4 vilões',
    ],
  },
  {
    id: 7,
    image: 'https://http2.mlstatic.com/D_NQ_NP_756944-MLB78558356270_082024-O.webp',
    name: 'Batman Armadura Mech',
    price: 89.9,
    category: 'Batman',
    badge: null,
    features: [
      '140 peças',
      'Braços articulados',
      'Batarang gigante',
      'Idade 6+',
    ],
  },
  {
    id: 8,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBuEjjoSIbZb8TNxDZ-ubSg0t45Xnsvq9DGtkrg6uYhRb8wJqWFXcAV-rS&s=10',
    name: 'Caminhão de Sorvete do Joker',
    price: 189.99,
    category: 'Vilões',
    badge: null,
    features: ['280 peças', 'Armadilhas ocultas', 'Cores clássicas do Coringa'],
  },
  {
    id: 9,
    image: 'https://http2.mlstatic.com/D_NQ_NP_634407-MLA99935759503_112025-O.webp',
    name: 'Moto do Bat-Herói',
    price: 79.5,
    category: 'Veículos',
    badge: null,
    features: ['95 peças', 'Pneus de borracha', 'Design aerodinâmico'],
  },
  {
    id: 10,
    image: 'https://i.pinimg.com/1200x/49/19/16/491916431f5c12dbdfd1a9c7ca1c33df.jpg',
    name: 'Charada e o Carro de Fuga',
    price: 134.0,
    category: 'Vilões',
    badge: null,
    features: [
      '160 peças',
      'Carro com disparadores',
      'Acompanha pistas secretas',
    ],
  },
  // ── NOVOS PRODUTOS ──
  {
    id: 11,
    image: 'https://i.pinimg.com/1200x/34/f6/4b/34f64b3be9b21146d02c6e28bb20155f.jpg',
    name: 'Batcaverna Ultimate',
    price: 899.9,
    category: 'Edição Limitada',
    badge: 'Novo',
    features: [
      '3306 peças',
      'Computador do Batman',
      'Garagem do Batmóvel',
      'Heliponto',
    ],
  },
  {
    id: 12,
    image: 'https://i.pinimg.com/1200x/76/29/4e/76294ea2edcf13e9019ea99326dcebfd.jpg',
    name: 'Batman vs Mulher-Gato',
    price: 219.0,
    category: 'Edição Limitada',
    badge: 'Novo',
    features: [
      '404 peças',
      '2 minifiguras exclusivas',
      'Cenário de Gotham City',
    ],
  },
  {
    id: 13,
    image: 'https://preview.redd.it/please-lego-make-a-penguin-submarine-no-more-duck-boats-v0-opfw3ki3f2xg1.jpg?width=478&format=pjpg&auto=webp&s=dbb9b8531be1080270ab62a9bc35abb14acd0583',
    name: 'Pinguim & Submersível',
    price: 174.5,
    category: 'Vilões',
    badge: 'Novo',
    features: ['279 peças', 'Guarda-chuva com gancho', 'Submarino temático'],
  },
  {
    id: 14,
    image: 'https://i.pinimg.com/1200x/0e/de/f1/0edef1dab1e5663d38d75547b49ebd7e.jpg',
    name: 'Batmóvel Tumbler',
    price: 549.0,
    category: 'Veículos',
    badge: 'Novo',
    features: [
      '2049 peças',
      'Réplica fiel do filme',
      'Cockpit abrível',
      'Escala 1:15',
    ],
  },
  {
    id: 15,
    image: 'https://i.pinimg.com/1200x/bf/98/2c/bf982c9407b1c35cf68218ddfddd387.jpg',
    name: 'Batman 1989 Clássico',
    price: 329.0,
    category: 'Edição Limitada',
    badge: 'Novo',
    features: [
      '3306 peças',
      'Batmóvel vintage incluso',
      'Baseado no filme de 1989',
    ],
  },
  {
    id: 16,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR3ilL2NcOu31EQ09hJnt9l8cIKryEA7Ega5UuDta9kw&s',
    name: 'Asa-Delta do Batman',
    price: 69.9,
    category: 'Batman',
    badge: null,
    features: [
      '182 peças',
      'Asas dobráveis',
      'Propulsores laterais',
      'Idade 7+',
    ],
  },
];

const shippingOptions = [
  {
    id: 'nightwing',
    name: 'Asa Noturna Express',
    price: 10.0,
    delivery: 'Chega em 2 dias',
    icon: 'bicycle-outline',
  },
  {
    id: 'batjet',
    name: 'Bat-Jato Priority',
    price: 35.0,
    delivery: 'Chega em 30 min na Batcaverna',
    icon: 'airplane-outline',
  },
  {
    id: 'arkham',
    name: 'Asilo Arkham Logística',
    price: 2.0,
    delivery: '7 dias (Risco de roubo por vilões)',
    icon: 'alert-circle-outline',
  },
];

const riddles = [
  {
    question: 'Quanto mais você tira de mim, maior eu fico. O que eu sou?',
    answer: 'buraco',
  },
  {
    question:
      'Tenho chaves, mas não abro fechaduras. Tenho espaço, mas não tenho salas. Você pode entrar, mas não pode sair. Quem sou eu?',
    answer: 'teclado',
  },
  {
    question:
      'O que pode correr mas nunca anda, tem um leito mas nunca dorme, nasce mas não morre?',
    answer: 'rio',
  },
];

const CATEGORY_COLORS = {
  Batman: '#1565C0',
  Vilões: '#6A1B9A',
  Veículos: '#00695C',
  'Edição Limitada': '#B71C1C',
};

const BADGE_COLORS = {
  'Mais Vendido': { bg: '#FFD700', text: '#000' },
  Novo: { bg: '#00E676', text: '#003300' },
};

// ─────────────────────────────────────────────
// COMPONENTE AUTENTICAÇÃO (CADASTRO / LOGIN / PERFIL)
// ─────────────────────────────────────────────
function AuthScreen({ colors, showToast, setScreen, theme, user, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@user_data');
      setUser(null);
      showToast("Você saiu da conta.");
      setScreen('cadastro'); // Redireciona para a tela de login/cadastro
    } catch (e) {
      showToast("Erro ao sair.");
    }
  };

  const handleAuth = async () => {
    if (!email || !senha || (!isLogin && !nome)) {
      showToast("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    const endpoint = isLogin ? "login" : "register";
    if (!AUTH_API_URL) {
      setLoading(false);
      showToast("Configure a URL da API de contas.");
      return;
    }
    const payload = isLogin ? { email, senha } : { nome, email, senha };

    try {
      const resposta = await fetch(
        `${AUTH_API_URL}?action=${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const dados = await resposta.json();
      
      if (resposta.ok) {
        const userData = dados.user;
        await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
        setUser(userData);
        showToast(isLogin ? `Bem-vindo, ${userData.nome}!` : "Cadastro realizado!");
        setScreen('home');
      } else {
        showToast(dados.message || dados.error || "Erro na autenticação.");
      }
    } catch (error) {
      console.error('Erro de autenticação:', error);
      showToast("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: colors.bg }}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Ionicons name="person-circle" size={80} color={colors.primary} />
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.textMain, marginTop: 10 }}>{user.nome}</Text>
          <Text style={{ color: colors.textSub }}>{user.email}</Text>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: '#ff4d4d', padding: 18, borderRadius: 12, alignItems: 'center' }}
          onPress={handleLogout}
        >
          <Text style={{ color: '#fff', fontWeight: '900', textTransform: 'uppercase' }}>Sair da Conta</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen('home')} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.textSub, textAlign: 'center' }}>Voltar para a Loja</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: colors.bg }}>
      <Text style={{ fontSize: 26, fontWeight: '900', color: colors.primary, textAlign: 'center', marginBottom: 30, letterSpacing: 2 }}>
        {isLogin ? (theme === 'batcaverna' ? 'BAT-LOGIN' : 'LOGIN') : (theme === 'batcaverna' ? 'BAT-CADASTRO' : 'CADASTRO')}
      </Text>
      
      <View style={{ gap: 15 }}>
        {!isLogin && (
          <TextInput
            style={{ backgroundColor: colors.cardBg, color: colors.textMain, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}
            placeholder="Nome Completo"
            placeholderTextColor={colors.textSub}
            value={nome}
            onChangeText={setNome}
          />
        )}
        <TextInput
          style={{ backgroundColor: colors.cardBg, color: colors.textMain, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}
          placeholder="E-mail"
          placeholderTextColor={colors.textSub}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={{ backgroundColor: colors.cardBg, color: colors.textMain, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}
          placeholder="Senha"
          placeholderTextColor={colors.textSub}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={{ backgroundColor: colors.primary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, opacity: loading ? 0.7 : 1 }}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <Text style={{ color: colors.primaryText, fontWeight: '900', textTransform: 'uppercase' }}>
              {isLogin ? "Entrar" : "Cadastrar"}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => {
          setIsLogin(!isLogin);
          setNome("");
          setEmail("");
          setSenha("");
        }} style={{ marginTop: 15 }}>
          <Text style={{ color: colors.accent, textAlign: 'center', fontWeight: '600' }}>
            {isLogin ? "Não tem conta? Cadastre-se aqui" : "Já tem conta? Faça login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen('home')} style={{ marginTop: 10 }}>
          <Text style={{ color: colors.textSub, textAlign: 'center' }}>Voltar para a Loja</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({}); // { productId: number (1-5) }
  const [search, setSearch] = useState('');
  const [screen, setScreen] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [category, setCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('default');
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [theme, setTheme] = useState('batcaverna');
  const [user, setUser] = useState(null); // { nome, email }

  const colors = {
    bg: theme === 'batcaverna' ? '#0a0a0a' : '#E8ECF0',
    cardBg: theme === 'batcaverna' ? '#141414' : '#FFFFFF',
    navbarBg: theme === 'batcaverna' ? '#111111' : '#FFFFFF',
    textMain: theme === 'batcaverna' ? '#FFFFFF' : '#1C1C1E',
    textSub: theme === 'batcaverna' ? '#666666' : '#7A7A80',
    primary: theme === 'batcaverna' ? '#FFD700' : '#7B1FA2',
    primaryText: theme === 'batcaverna' ? '#000000' : '#FFFFFF',
    accent: theme === 'batcaverna' ? '#FFD700' : '#00E676',
    border: theme === 'batcaverna' ? '#222222' : '#D1D1D6',
    activeTab: theme === 'batcaverna' ? '#FFD700' : '#7B1FA2',
    inactiveTab: '#888888',
  };

  const [cep, setCep] = useState('');
  const [address, setAddress] = useState(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [activeDiscount, setActiveDiscount] = useState({
    type: null,
    value: 0,
  });
  const [riddleModalVisible, setRiddleModalVisible] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingProduct, setRatingProduct] = useState(null);
  const [pendingRating, setPendingRating] = useState(0);
  const [currentRiddle, setCurrentRiddle] = useState({
    question: '',
    answer: '',
  });
  const [riddleAnswerInput, setRiddleAnswerInput] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const toastAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animações de cards
  const cardAnims = useRef(products.map(() => new Animated.Value(0))).current;

  useEffect(() => {
  fadeAnim.setValue(0);
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 400,
    useNativeDriver: true,
  }).start();
}, [screen, fadeAnim]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('@user_data');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Erro ao carregar usuário", e);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      setSelectedShipping(null);
      setActiveDiscount({ type: null, value: 0 });
      setCouponInput('');
      setCep('');
      setAddress(null);
    }
  }, [cart]);

  const animateCards = useCallback(
    (indices) => {
      const animations = indices.map((i, seq) =>
        Animated.timing(cardAnims[i], {
          toValue: 1,
          duration: 350,
          delay: seq * 60,
          useNativeDriver: true,
        })
      );
      Animated.stagger(60, animations).start();
    },
    [cardAnims]
  );

  const handleCepChange = async (text) => {
    const cleaned = text.replace(/\D/g, '');
    setCep(cleaned);
    if (cleaned.length === 8) {
      setLoadingCep(true);
      setAddress(null);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress(
            `${data.bairro ? data.bairro + ', ' : ''}${data.localidade} - ${
              data.uf
            }`
          );
        } else {
          setAddress('Bat-sinal perdido: CEP não encontrado.');
        }
      } catch {
        setAddress('Erro na comunicação com o satélite de Gotham.');
      } finally {
        setLoadingCep(false);
      }
    } else {
      setAddress(null);
    }
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === 'BATARANG10') {
      setActiveDiscount({ type: 'bat', value: 10 });
      showToast('Cupom BATARANG10 aplicado! R$ 10,00 de desconto.');
    } else if (code === 'CHARADA50') {
      const idx = Math.floor(Math.random() * riddles.length);
      setCurrentRiddle(riddles[idx]);
      setRiddleAnswerInput('');
      setRiddleModalVisible(true);
    } else {
      showToast('Cupom desconhecido no submundo!');
    }
  };

  const verifyRiddleAnswer = () => {
    const userAnswer = riddleAnswerInput.trim().toLowerCase();
    setRiddleModalVisible(false);
    if (userAnswer.includes(currentRiddle.answer)) {
      setActiveDiscount({ type: 'riddle', value: 50 });
      showToast('Incrível! Enigma decifrado. 50% de desconto aplicado!');
    } else {
      showToast('Resposta errada! O Charada sumiu nas sombras...');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const filteredProducts = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'Todos' || p.category === category;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'asc') return a.price - b.price;
      if (sortBy === 'desc') return b.price - a.price;
      if (sortBy === 'rating')
        return (ratings[b.id] || 0) - (ratings[a.id] || 0);
      return 0;
    });

  const addToCart = (product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex)
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`"${product.name}" adicionado ao Bat-sinal!`);
  };

  const updateQuantity = (id, change) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + change } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const openDetails = (product) => {
    setSelectedProduct(product);
    setScreen('details');
  };

  const openRatingModal = (product) => {
    setRatingProduct(product);
    setPendingRating(ratings[product.id] || 0);
    setRatingModalVisible(true);
  };

  const submitRating = () => {
    if (ratingProduct) {
      setRatings((prev) => ({
        ...prev,
        [ratingProduct.id]: pendingRating,
      }));
      showToast(`Você avaliou "${ratingProduct.name}" com ${pendingRating} estrelas!`);
      setRatingModalVisible(false);
    }
  };

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
  const productsAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingPrice = selectedShipping ? selectedShipping.price : 0;

  let finalDiscountAmount = 0;
  if (activeDiscount.type === 'bat')
    finalDiscountAmount = activeDiscount.value;
  else if (activeDiscount.type === 'riddle')
    finalDiscountAmount = productsAmount * (activeDiscount.value / 100);
  const totalAmount = Math.max(
    0,
    productsAmount + shippingPrice - finalDiscountAmount
  );

    const handleMercadoPagoCheckout = async () => {
    // Verifica se o usuário está logado antes de permitir o checkout
    if (!user) {
      Alert.alert(
        'Crie sua conta',
        'Para finalizar sua compra, é necessário criar uma conta ou fazer login. Deseja ir para a tela de cadastro agora?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Criar Conta', onPress: () => setScreen('cadastro') },
        ],
        { cancelable: true }
      );
      return;
    }

    if (!selectedShipping) {
      alert('Por favor, selecione um método de entrega antes de prosseguir com o pagamento!');
      return;
    }

    // Simulação de chamada ao backend para criar a preferência de pagamento
    // Em um ambiente de produção, esta chamada seria para o seu servidor backend
    // que, por sua vez, se comunicaria com a API do Mercado Pago de forma segura.
    try {
      // Calcula o desconto total para distribuir proporcionalmente entre os itens
      const totalDiscountValue = finalDiscountAmount;
      const discountRatio = productsAmount > 0 ? totalDiscountValue / productsAmount : 0;

      // Itens do carrinho com preço ajustado pelo desconto (proporcional por item)
      const mpItems = cart.map(item => {
    // Garante que o preço seja um número limpo e válido para a API
    const cleanPrice = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^\d.]/g, '')) // Remove R$, espaços, etc.
      : Number(item.price);

    // Aplica desconto proporcional ao valor do item
    const itemTotal = cleanPrice * item.quantity;
    const itemDiscount = itemTotal * discountRatio;
    const discountedPrice = itemTotal - itemDiscount;
    const finalUnitPrice = item.quantity > 0 ? discountedPrice / item.quantity : 0;

    return {
      title: item.name,
      unit_price: Number(finalUnitPrice.toFixed(2)), // Preço com desconto aplicado
      quantity: parseInt(item.quantity, 10) || 1, // Garante que seja um inteiro
      currency_id: 'BRL', // Extremamente recomendado incluir
    };
  });

  // Adiciona o frete como um item adicional
  if (selectedShipping && selectedShipping.price > 0) {
    mpItems.push({
      title: `Frete - ${selectedShipping.name}`,
      unit_price: Number(selectedShipping.price.toFixed(2)),
      quantity: 1,
      currency_id: 'BRL',
    });
  }

      const orderData = {
  items: mpItems,
  payer: {
    email: user ? user.email : 'visitante@exemplo.com',
  },
  back_urls: {
    success: 'myapp://checkout/success',
    pending: 'myapp://checkout/pending',
    failure: 'myapp://checkout/failure',
  },
  auto_return: 'approved',
  external_reference: Date.now().toString(),
};

      // A URL abaixo deve ser o endpoint do seu backend que cria a preferência de pagamento.
      // EM PRODUÇÃO, USE SEMPRE HTTPS E UM DOMÍNIO PÚBLICO. NUNCA IP LOCAL.
     const backendUrl = 'https://mercado-pago-backend-0yyl.onrender.com/create_preference';
 // <-- ATUALIZE ESTA URL

            const response = await fetch(
        backendUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true', // <-- ADICIONE ESTA LINHA AQUI
          },
          body: JSON.stringify(orderData),
        }
      );


      

      // --- INÍCIO DA CORREÇÃO: Tratamento de erro na resposta do backend ---
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
        console.error('Erro ao criar preferência de pagamento:', errorData);
        showToast(`Erro no servidor: ${errorData.message || 'Verifique o console.'}`);
        return;
      }
      // --- FIM DA CORREÇÃO ---

      const preference = await response.json();

      if (preference.init_point) {
        // --- NOTA IMPORTANTE: Configuração de Deep Linking ---
        // Certifique-se de que o 'scheme' do seu aplicativo (ex: 'myapp') esteja configurado no app.json
        // e que as back_urls no Mercado Pago correspondam a este esquema para o redirecionamento funcionar corretamente.
        const result = await openBrowserAsync(preference.init_point);
        console.log('Mercado Pago result:', result);
        showToast('Redirecionando para o Mercado Pago...');

        // --- INÍCIO DA CORREÇÃO: Finalização do pedido após confirmação de pagamento ---
        // A função finalizeOrder() NÃO deve ser chamada imediatamente aqui.
        // Você deve aguardar a confirmação do pagamento via webhook (IPN) no seu backend
        // ou através do retorno do deep link (se configurado para isso) para só então
        // atualizar o status do pedido e limpar o carrinho.
        // Por enquanto, esta linha está comentada para evitar a limpeza antecipada do carrinho.
        // finalizeOrder(); 
        showToast('Aguardando confirmação de pagamento...');
        // --- FIM DA CORREÇÃO ---

      } else {
        showToast('Erro ao iniciar o pagamento com Mercado Pago. Ponto de inicialização não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento com Mercado Pago:', error);
      console.log('ERRO REAL AQUI:', error.message);
      showToast('Erro ao processar pagamento. Tente novamente.');
    }
  };

  const finalizeOrder = () => {
    if (!selectedShipping) {
      alert('Por favor, selecione um método de entrega!');
      return;
    }
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      items: [...cart],
      shipping: selectedShipping,
      total: totalAmount,
      status: 'Processando',
      address: address || 'Não informado',
    };
    setOrderHistory((prev) => [newOrder, ...prev]);
    setCart([]);
    showToast('Pedido enviado à Wayne Enterprises!');
    setScreen('home');
  };

  // ── Botão animado ──
  const AnimatedButton = ({ children, onPress, style }) => {
    const scale = useRef(new Animated.Value(1)).current;
    return (
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          onPressIn={() =>
            Animated.spring(scale, {
              toValue: 0.95,
              friction: 4,
              tension: 50,
              useNativeDriver: true,
            }).start()
          }
          onPressOut={() =>
            Animated.spring(scale, {
              toValue: 1,
              friction: 4,
              tension: 50,
              useNativeDriver: true,
            }).start()
          }
          style={styles.buttonActionArea}>
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // ── Estrelas de avaliação ──
  const StarRow = ({ productId, size = 16, interactive = false, onPress }) => {
    const r = ratings[productId] || 0;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!interactive}
            onPress={() => onPress && onPress(star)}
            activeOpacity={0.7}>
            <Ionicons
              name={star <= r ? 'star' : 'star-outline'}
              size={size}
              color={star <= r ? '#FFD700' : '#444'}
            />
          </TouchableOpacity>
        ))}
        {r > 0 && (
          <Text style={{ color: colors.textSub, fontSize: 11, marginLeft: 4 }}>
            ({r}.0)
          </Text>
        )}
      </View>
    );
  };

  // ── Badge do produto ──
  const ProductBadge = ({ badge }) => {
    if (!badge) return null;
    const { bg, text } = BADGE_COLORS[badge] || { bg: '#444', text: '#fff' };
    return (
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Text style={[styles.badgeText, { color: text }]}>{badge}</Text>
      </View>
    );
  };

  // ── Tag de categoria ──
  const CategoryTag = ({ cat }) => {
    const color = CATEGORY_COLORS[cat] || '#555';
    return (
      <View
        style={[
          styles.categoryTag,
          { backgroundColor: color + '33', borderColor: color },
        ]}>
        <Text style={[styles.categoryTagText, { color }]}>{cat}</Text>
      </View>
    );
  };

  const toastYOffset = toastAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 0],
  });

  // ── Status do pedido ──
  const ORDER_STATUSES = ['Processando', 'Enviado', 'Entregue'];
  const statusColor = (s) =>
    ({ Processando: '#FF9800', Enviado: '#2196F3', Entregue: '#4CAF50' }[s] ||
    '#888');

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={theme === 'batcaverna' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
        translucent={false}
      />

      {/* ── MODAL CHARADA ── */}
      <Modal
        animationType="slide"
        transparent
        visible={riddleModalVisible}
        onRequestClose={() => setRiddleModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.cardBg, borderColor: colors.accent },
            ]}>
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalQuestionMark, { color: colors.accent }]}>
                ?
              </Text>
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>
                O ENIGMA DO CHARADA
              </Text>
              <Text
                style={[styles.modalQuestionMark, { color: colors.accent }]}>
                ?
              </Text>
            </View>
            <Text style={[styles.modalText, { color: colors.textMain }]}>
              {currentRiddle.question}
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.bg,
                  color: colors.textMain,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Sua resposta em uma palavra..."
              placeholderTextColor="#555"
              value={riddleAnswerInput}
              onChangeText={setRiddleAnswerInput}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={verifyRiddleAnswer}>
              <Text
                style={[styles.modalButtonText, { color: colors.primaryText }]}>
                Enviar Resposta
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setRiddleModalVisible(false)}>
              <Text
                style={[
                  styles.modalCancelButtonText,
                  { color: colors.textSub },
                ]}>
                Desistir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── MODAL AVALIAÇÃO ── */}
      <Modal
        animationType="fade"
        transparent
        visible={ratingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.cardBg, borderColor: '#FFD700' },
            ]}>
            <Text
              style={[
                styles.modalTitle,
                { color: colors.textMain, marginBottom: 8 },
              ]}>
              ⭐ AVALIAR PRODUTO
            </Text>
            <Text
              style={[
                styles.modalText,
                { color: colors.textSub, fontSize: 13 },
              ]}>
              {ratingProduct?.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
                marginVertical: 20,
              }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setPendingRating(star)}
                  activeOpacity={0.7}>
                  <Ionicons
                    name={star <= pendingRating ? 'star' : 'star-outline'}
                    size={36}
                    color={star <= pendingRating ? '#FFD700' : '#444'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: pendingRating > 0 ? '#FFD700' : '#333' },
              ]}
              onPress={submitRating}
              disabled={pendingRating === 0}>
              <Text
                style={[
                  styles.modalButtonText,
                  { color: pendingRating > 0 ? '#000' : '#666' },
                ]}>
                Confirmar Avaliação
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setRatingModalVisible(false)}>
              <Text
                style={[
                  styles.modalCancelButtonText,
                  { color: colors.textSub },
                ]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── TOAST ── */}
      <Animated.View
        style={[
          styles.toastContainer,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.accent,
            shadowColor: colors.accent,
            opacity: toastAnim,
            transform: [{ translateY: toastYOffset }],
          },
        ]}>
        <Ionicons
          name="shield-checkmark"
          size={20}
          color={colors.accent}
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.toastText, { color: colors.textMain }]}>
          {toastMessage}
        </Text>
      </Animated.View>

      {/* ════════════════════════════════════════
          HOME
      ════════════════════════════════════════ */}
      {screen === 'cadastro' && (
        <Animated.View style={[styles.flexOne, { opacity: fadeAnim }]}>
          <AuthScreen 
            colors={colors} 
            showToast={showToast} 
            setScreen={setScreen} 
            theme={theme}
            user={user}
            setUser={setUser}
          />
        </Animated.View>
      )}

      {screen === 'home' && (
        <Animated.View style={[styles.flexOne, { opacity: fadeAnim }]}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            stickyHeaderIndices={[1]} // Make category bar sticky
          >
            <View style={[styles.hero, { backgroundColor: colors.bg }]}>
              <Text
                style={[
                  styles.heroTitle,
                  {
                    color: colors.primary,
                    textShadowColor: colors.primary + '80',
                  },
                ]}>
                BAT-STORE
              </Text>
              <Text style={[styles.heroText, { color: colors.textSub }]}>
                {theme === 'batcaverna'
                  ? 'Seu arsenal tático e colecionáveis do Cavaleiro das Trevas.'
                  : 'A loja oficial para todos os seus equipamentos de combate ao crime.'}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 10,
                paddingVertical: 10,
                backgroundColor: colors.bg, // Ensure background is consistent
              }}
              style={styles.categoryBar}>
              {['Todos', ...new Set(products.map((p) => p.category))].map(
                (item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setCategory(item)}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: colors.cardBg,
                        borderColor: colors.border,
                      },
                      category === item && {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.categoryText,
                        { color: colors.textSub },
                        category === item && {
                          color: colors.primaryText,
                          fontWeight: '900',
                        },
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>

            <View style={styles.sortBar}>
              <Text style={[styles.sortLabel, { color: colors.textSub }]}>
                Ordenar:
              </Text>
              {[
                { key: 'asc', label: '📈 Preço' },
                { key: 'desc', label: '📉 Preço' },
                { key: 'rating', label: '⭐ Nota' },
              ].map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.sortButton,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                    },
                    sortBy === key && { borderColor: colors.accent },
                  ]}
                  onPress={() => setSortBy(sortBy === key ? 'default' : key)}>
                  <Text
                    style={[
                      styles.sortButtonText,
                      { color: colors.textSub },
                      sortBy === key && { color: colors.accent },
                    ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              onLayout={() =>
                animateCards(filteredProducts.map((p) => products.indexOf(p)))
              }
              ListHeaderComponent={
                <TextInput
                  style={[
                    styles.search,
                    {
                      backgroundColor: colors.cardBg,
                      color: colors.textMain,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder={
                    theme === 'batcaverna'
                      ? '🔍 Buscar no submundo de Gotham...'
                      : '🔍 Pesquisar fichas criminais...'
                  }
                  placeholderTextColor={colors.textSub}
                  value={search}
                  onChangeText={setSearch}
                />
              }
              ListEmptyComponent={
                <Text
                  style={[
                    styles.empty,
                    { color: colors.textSub, textAlign: 'center', marginTop: 32 },
                  ]}>
                  Nenhum produto encontrado nas sombras de Gotham.
                </Text>
              }
              renderItem={({ item, index }) => {
                const anim = cardAnims[products.indexOf(item)];
                return (
                  <Animated.View
                    style={[
                      styles.card,
                      {
                        backgroundColor: colors.cardBg,
                        borderColor: colors.border,
                      },
                      {
                        opacity: anim,
                        transform: [
                          {
                            translateY: anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [24, 0],
                            }),
                          },
                        ],
                      },
                    ]}>
                    {/* Badge */}
                    <ProductBadge badge={item.badge} />

                    {/* Favorito */}
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => toggleFavorite(item.id)}>
                      <Ionicons
                        name={
                          favorites.includes(item.id) ? 'heart' : 'heart-outline'
                        }
                        size={26}
                        color={
                          favorites.includes(item.id) ? '#ff4d4d' : colors.textSub
                        }
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => openDetails(item)}
                      activeOpacity={0.85}>
                      <Image source={{ uri: item.image }} style={styles.image} />
                    </TouchableOpacity>

                    <CategoryTag cat={item.category} />

                    <Text style={[styles.name, { color: colors.textMain }]}>
                      {item.name}
                    </Text>

                    {/* Estrelas */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 4,
                      }}>
                      <StarRow productId={item.id} />
                      <TouchableOpacity onPress={() => openRatingModal(item)}>
                        <Text
                          style={{
                            color: colors.accent,
                            fontSize: 11,
                            fontWeight: '700',
                          }}>
                          {ratings[item.id] ? 'Alterar nota' : 'Avaliar'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.price, { color: colors.accent }]}>
                      R$ {item.price.toFixed(2)}
                    </Text>

                    <AnimatedButton
                      onPress={() => addToCart(item)}
                      style={[
                        styles.button,
                        { backgroundColor: colors.primary },
                      ]}>
                      <Text
                        style={[
                          styles.buttonText,
                          { color: colors.primaryText },
                        ]}>
                        Adicionar ao Carrinho
                      </Text>
                    </AnimatedButton>
                  </Animated.View>
                );
              }}
            />
          </ScrollView>
        </Animated.View>
      )}

      {/* ════════════════════════════════════════
          DETAILS
      ════════════════════════════════════════ */}
      {screen === 'details' && selectedProduct && (
        <Animated.View style={[styles.flexOne, { opacity: fadeAnim }]}>
          <ScrollView contentContainerStyle={styles.detailsContainer}>
            <Image
              source={{ uri: selectedProduct.image }}
              style={styles.detailsImage}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 16,
              }}>
              <CategoryTag cat={selectedProduct.category} />
              {selectedProduct.badge && (
                <ProductBadge badge={selectedProduct.badge} />
              )}
            </View>

            <Text style={[styles.detailsName, { color: colors.textMain }]}>
              {selectedProduct.name}
            </Text>
            <Text style={[styles.detailsPrice, { color: colors.accent }]}>
              R$ {selectedProduct.price.toFixed(2)}
            </Text>

            {/* Avaliação detalhes */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}>
              <StarRow productId={selectedProduct.id} size={20} />
              <TouchableOpacity
                style={[styles.rateButton, { borderColor: colors.accent }]}
                onPress={() => openRatingModal(selectedProduct)}>
                <Text
                  style={{
                    color: colors.accent,
                    fontSize: 12,
                    fontWeight: '700',
                  }}>
                  {ratings[selectedProduct.id]
                    ? '✏️ Editar avaliação'
                    : '⭐ Avaliar produto'}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.featuresBox,
                { backgroundColor: colors.cardBg, borderColor: colors.border },
              ]}>
              <Text style={[styles.featuresTitle, { color: colors.textMain }]}>
                Especificações Técnicas
              </Text>
              {selectedProduct.features.map((f, i) => (
                <Text
                  key={i}
                  style={[styles.featureItem, { color: colors.textMain }]}>
                  ⚡ {f}
                </Text>
              ))}
            </View>

            <AnimatedButton
              onPress={() => addToCart(selectedProduct)}
              style={[styles.button, { backgroundColor: colors.primary }]}>
              <Text style={[styles.buttonText, { color: colors.primaryText }]}>
                Adicionar ao Carrinho
              </Text>
            </AnimatedButton>

            <AnimatedButton
              onPress={() => setScreen('home')}
              style={[
                styles.button,
                styles.secondaryButton,
                { borderColor: colors.primary },
              ]}>
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                {theme === 'batcaverna'
                  ? 'Voltar para a Batcaverna'
                  : 'Retornar ao Pátio Central'}
              </Text>
            </AnimatedButton>
          </ScrollView>
        </Animated.View>
      )}

      {/* ════════════════════════════════════════
          CART
      ════════════════════════════════════════ */}
      {screen === 'cart' && (
        <Animated.View style={[styles.flexOne, { opacity: fadeAnim }]}>
          <ScrollView contentContainerStyle={styles.cartContainer}>
            <Text style={[styles.cartTitle, { color: colors.textMain }]}>
              🛒 Seu Arsenal ({totalItemsInCart})
            </Text>

            {cart.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="shield-outline"
                  size={60}
                  color={colors.border}
                  style={{ marginBottom: 16 }}
                />
                <Text style={[styles.empty, { color: colors.textSub }]}>
                  {theme === 'batcaverna'
                    ? 'Seu carrinho está tão vazio quanto Gotham à noite.'
                    : 'Celas limpas. Nenhum prisioneiro registrado.'}
                </Text>
              </View>
            ) : (
              <>
                {cart.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.cartCard,
                      {
                        backgroundColor: colors.cardBg,
                        borderColor: colors.border,
                      },
                    ]}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.cartImage}
                    />
                    <View style={styles.cartDetails}>
                      <Text
                        style={[
                          styles.cartItemName,
                          { color: colors.textMain },
                        ]}>
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.cartItemPrice,
                          { color: colors.accent },
                        ]}>
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </Text>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity
                          style={[
                            styles.qtyButton,
                            { backgroundColor: colors.bg },
                          ]}
                          onPress={() => updateQuantity(item.id, -1)}>
                          <Text
                            style={[
                              styles.qtyButtonText,
                              { color: colors.textMain },
                            ]}>
                            -
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={[styles.qtyText, { color: colors.textMain }]}>
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.qtyButton,
                            { backgroundColor: colors.bg },
                          ]}
                          onPress={() => updateQuantity(item.id, 1)}>
                          <Text
                            style={[
                              styles.qtyButtonText,
                              { color: colors.textMain },
                            ]}>
                            +
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.removeIconButton}
                      onPress={() => removeFromCart(item.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ff4d4d"
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* CEP */}
                <View
                  style={[
                    styles.shippingBox,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.shippingBoxTitle,
                      { color: colors.textMain },
                    ]}>
                    🗺️ Localizar Batcaverna de Entrega
                  </Text>
                  <View style={styles.cepInputRow}>
                    <TextInput
                      style={[
                        styles.cepInput,
                        {
                          backgroundColor: colors.bg,
                          color: colors.textMain,
                          borderColor: colors.border,
                        },
                      ]}
                      placeholder="Digite seu CEP (Ex: 01001000)"
                      placeholderTextColor="#555"
                      maxLength={8}
                      keyboardType="numeric"
                      value={cep}
                      onChangeText={handleCepChange}
                    />
                    {loadingCep && (
                      <ActivityIndicator
                        color={colors.accent}
                        style={{ marginLeft: 10 }}
                      />
                    )}
                  </View>
                  {address && (
                    <Text
                      style={[
                        styles.addressText,
                        {
                          color: address.includes('perdido')
                            ? '#ff4d4d'
                            : colors.textMain,
                        },
                      ]}>
                      📍 {address}
                    </Text>
                  )}
                </View>

                {/* FRETE */}
                <View
                  style={[
                    styles.shippingBox,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                      marginTop: 14,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.shippingBoxTitle,
                      { color: colors.textMain },
                    ]}>
                    🚀 Escolha sua Bat-Entrega
                  </Text>
                  {shippingOptions.map((option) => {
                    const isSelected = selectedShipping?.id === option.id;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.shippingOptionCard,
                          {
                            backgroundColor: colors.bg,
                            borderColor: colors.border,
                          },
                          isSelected && {
                            backgroundColor: colors.primary,
                            borderColor: colors.primary,
                          },
                        ]}
                        onPress={() => setSelectedShipping(option)}>
                        <View style={styles.shippingOptionLeft}>
                          <Ionicons
                            name={option.icon}
                            size={22}
                            color={
                              isSelected ? colors.primaryText : colors.primary
                            }
                            style={{ marginRight: 12 }}
                          />
                          <View>
                            <Text
                              style={[
                                styles.shippingName,
                                { color: colors.textMain },
                                isSelected && {
                                  color: colors.primaryText,
                                  fontWeight: 'bold',
                                },
                              ]}>
                              {option.name}
                            </Text>
                            <Text
                              style={[
                                styles.shippingDelivery,
                                { color: colors.textSub },
                                isSelected && { color: colors.primaryText },
                              ]}>
                              {option.delivery}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={[
                            styles.shippingPriceText,
                            { color: colors.accent },
                            isSelected && {
                              color: colors.primaryText,
                              fontWeight: 'bold',
                            },
                          ]}>
                          R$ {option.price.toFixed(2)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* CUPONS */}
                <View
                  style={[
                    styles.shippingBox,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                      marginTop: 14,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.shippingBoxTitle,
                      { color: colors.textMain },
                    ]}>
                    🎫 Bat-Cupons Secretos
                  </Text>
                  <View style={styles.couponRow}>
                    <TextInput
                      style={[
                        styles.couponInput,
                        {
                          backgroundColor: colors.bg,
                          color: colors.textMain,
                          borderColor: colors.border,
                        },
                      ]}
                      placeholder="Insira o código do cupom..."
                      placeholderTextColor="#555"
                      value={couponInput}
                      onChangeText={setCouponInput}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity
                      style={[
                        styles.couponButton,
                        { backgroundColor: colors.accent },
                      ]}
                      onPress={applyCoupon}>
                      <Text
                        style={[
                          styles.couponButtonText,
                          { color: colors.primaryText },
                        ]}>
                        Aplicar
                      </Text>
                    </TouchableOpacity>
                  </View>

                </View>

                {/* RESUMO */}
                <View
                  style={[
                    styles.totalContainer,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                    },
                  ]}>
                  <View>
                    <Text
                      style={[
                        styles.subtotalLabel,
                        { color: colors.textMain },
                      ]}>
                      Itens: R$ {productsAmount.toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        styles.subtotalLabel,
                        { color: colors.textMain },
                      ]}>
                      Frete: '
                      {selectedShipping
                        ? `R$ ${shippingPrice.toFixed(2)}`
                        : 'Selecione'}
                    </Text>
                    {finalDiscountAmount > 0 && (
                      <Text
                        style={[
                          styles.subtotalLabel,
                          { color: '#ff4d4d', fontWeight: 'bold' },
                        ]}>
                        Desconto: -R$ {finalDiscountAmount.toFixed(2)}
                      </Text>
                    )}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text
                      style={[styles.totalLabel, { color: colors.textSub }]}>
                      Total Geral:
                    </Text>
                    <Text style={[styles.totalValue, { color: colors.accent }]}>
                      R$ {totalAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <AnimatedButton
                  style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleMercadoPagoCheckout}>
                  <Text
                    style={[styles.buttonText, { color: colors.primaryText }]}>
                    Finalizar Compra
                  </Text>
                </AnimatedButton>
              </>
            )}
          </ScrollView>
        </Animated.View>
      )}

      {/* ════════════════════════════════════════
          HISTÓRICO DE PEDIDOS
      ════════════════════════════════════════ */}
      {screen === 'history' && (
        <Animated.View style={[styles.flexOne, { opacity: fadeAnim }]}>
          <ScrollView contentContainerStyle={styles.cartContainer}>
            <Text style={[styles.cartTitle, { color: colors.textMain }]}>
              📦 Histórico de Pedidos
            </Text>

            {orderHistory.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="receipt-outline"
                  size={60}
                  color={colors.border}
                  style={{ marginBottom: 16 }}
                />
                <Text style={[styles.empty, { color: colors.textSub }]}>
                  Nenhum pedido registrado nos arquivos de Gotham.
                </Text>
              </View>
            ) : (
              orderHistory.map((order) => (
                <View
                  key={order.id}
                  style={[
                    styles.orderCard,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                    },
                  ]}>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text
                        style={[styles.orderDate, { color: colors.textMain }]}>
                        Pedido #{String(order.id).slice(-6)}
                      </Text>
                      <Text
                        style={[
                          styles.orderSubDate,
                          { color: colors.textSub },
                        ]}>
                        {order.date}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: statusColor(order.status) + '22',
                          borderColor: statusColor(order.status),
                        },
                      ]}>
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusColor(order.status) },
                        ]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  {/* Progress tracker */}
                  <View style={styles.progressRow}>
                    {ORDER_STATUSES.map((s, i) => {
                      const reached = ORDER_STATUSES.indexOf(order.status) >= i;
                      return (
                        <React.Fragment key={s}>
                          <View
                            style={[
                              styles.progressDot,
                              {
                                backgroundColor: reached
                                  ? statusColor(order.status)
                                  : colors.border,
                              },
                            ]}>
                            <Ionicons
                              name={
                                i === 0
                                  ? 'time-outline'
                                  : i === 1
                                  ? 'airplane-outline'
                                  : 'checkmark-circle-outline'
                              }
                              size={12}
                              color={reached ? '#fff' : colors.textSub}
                            />
                          </View>
                          {i < ORDER_STATUSES.length - 1 && (
                            <View
                              style={[
                                styles.progressLine,
                                {
                                  backgroundColor:
                                    reached &&
                                    ORDER_STATUSES.indexOf(order.status) > i
                                      ? statusColor(order.status)
                                      : colors.border,
                                },
                              ]}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </View>
                  <View style={styles.progressLabels}>
                    {ORDER_STATUSES.map((s) => (
                      <Text
                        key={s}
                        style={[
                          styles.progressLabel,
                          {
                            color:
                              order.status === s
                                ? statusColor(s)
                                : colors.textSub,
                          },
                        ]}>
                        {s}
                      </Text>
                    ))}
                  </View>

                  <View
                    style={[
                      styles.orderDivider,
                      { borderColor: colors.border },
                    ]}
                  />

                  {order.items.map((it) => (
                    <View key={it.id} style={styles.orderItemRow}>
                      <Text
                        style={[
                          styles.orderItemName,
                          { color: colors.textMain },
                        ]}>
                        {it.name}
                      </Text>
                      <Text
                        style={[
                          styles.orderItemQty,
                          { color: colors.textSub },
                        ]}>
                        x{it.quantity}
                      </Text>
                      <Text
                        style={[
                          styles.orderItemPrice,
                          { color: colors.accent },
                        ]}>
                        R$ {(it.price * it.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))}

                  <View
                    style={[
                      styles.orderDivider,
                      { borderColor: colors.border },
                    ]}
                  />

                  <View style={styles.orderFooter}>
                    <Text
                      style={[styles.orderShipping, { color: colors.textSub }]}>
                      🚚 {order.shipping.name}
                    </Text>
                    <Text style={[styles.orderTotal, { color: colors.accent }]}>
                      Total: R$ {order.total.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </Animated.View>
      )}

      {/* ── NAVBAR (RODAPÉ) ── */}
      <View
        style={[
          styles.navbar,
          { backgroundColor: colors.navbarBg, borderColor: colors.border },
        ]}>
        {[
          { key: 'home', label: 'Loja', icon: 'home' },
          {
            key: 'history',
            label: `Pedidos${
              orderHistory.length > 0 ? ` (${orderHistory.length})` : ''
            }`,
            icon: 'receipt',
          },
          {
            key: 'cadastro',
            label: user ? 'Perfil' : 'Conta',
            icon: user ? 'person' : 'person-add',
          },
        ].map(({ key, label, icon }) => (
          <TouchableOpacity
            key={key}
            style={styles.navTab}
            onPress={() => setScreen(key)}>
            <View style={styles.navTabContent}>
              <Ionicons
                name={screen === key ? icon : `${icon}-outline`}
                size={20}
                color={screen === key ? colors.activeTab : colors.inactiveTab}
              />
              <Text
                style={[
                  styles.navButton,
                  { color: colors.inactiveTab },
                  screen === key && {
                    color: colors.activeTab,
                    fontWeight: '900',
                  },
                ]}>
                {label}
              </Text>
            </View>
            {screen === key && (
              <View
                style={[
                  styles.activeIndicator,
                  { backgroundColor: colors.activeTab },
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.themeToggleNav}
          onPress={() =>
            setTheme((prev) => (prev === 'batcaverna' ? 'gotham' : 'batcaverna'))
          }>
          <Ionicons
            name={theme === 'batcaverna' ? 'moon' : 'sunny'}
            size={20}
            color={colors.textMain}
          />
          <Text style={[styles.themeToggleText, { color: colors.textMain }]}>
            {theme === 'batcaverna' ? 'Gotham' : 'Batcaverna'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => setScreen('cart')}>
          <View style={styles.navTabContent}>
            <Ionicons
              name={screen === 'cart' ? 'cart' : 'cart-outline'}
              size={20}
              color={screen === 'cart' ? colors.activeTab : colors.inactiveTab}
            />
            <Text
              style={[
                styles.navButton,
                { color: colors.inactiveTab },
                screen === 'cart' && {
                  color: colors.activeTab,
                  fontWeight: '900',
                },
              ]}>
              Carrinho ({totalItemsInCart})
            </Text>
          </View>
          {screen === 'cart' && (
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.activeTab },
              ]}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  flexOne: { flex: 1 },
  listContainer: { paddingBottom: 30 },
  buttonActionArea: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  toastContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 999,
    elevation: 6,
  },
  toastText: { fontWeight: '700', fontSize: 14, flex: 1 },
  navbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  navTab: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  themeToggleNav: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  themeToggleText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  navTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: { fontSize: 12, marginLeft: 4 },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: '45%',
    height: 3,
    borderRadius: 2,
  },
  hero: {
    alignItems: 'center',
    // Padding para a status bar no Android; no iOS o SafeAreaView já cuida disso
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroText: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  search: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    fontSize: 15,
  },
  categoryBar: { marginBottom: 5 },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: { fontSize: 12, fontWeight: '600' },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginVertical: 8,
    gap: 6,
  },
  sortLabel: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  sortButtonText: { fontSize: 11, fontWeight: '600' },
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 6,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteButton: { position: 'absolute', top: 14, right: 14, zIndex: 10 },
  image: { width: 220, height: 220, borderRadius: 14, resizeMode: 'contain' },
  name: { fontSize: 18, marginTop: 8, fontWeight: 'bold', textAlign: 'center' },
  price: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  rateButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  button: {
    borderRadius: 12,
    width: '100%',
    overflow: 'hidden',
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '900',
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    marginTop: 10,
  },
  detailsContainer: { padding: 20, alignItems: 'center' },
  detailsImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  detailsName: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 12,
    textAlign: 'center',
  },
  detailsPrice: { fontSize: 26, fontWeight: '900', marginVertical: 10 },
  featuresBox: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 20,
  },
  featuresTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  featureItem: { fontSize: 14, marginVertical: 4, fontWeight: '500' },
  cartContainer: { padding: 20, paddingBottom: 40 },
  cartTitle: { fontSize: 22, fontWeight: '900', marginBottom: 20 },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    position: 'relative',
  },
  cartImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: '#fff',
  },
  cartDetails: { flex: 1, marginLeft: 14 },
  cartItemName: { fontSize: 15, fontWeight: 'bold' },
  cartItemPrice: { fontSize: 16, fontWeight: 'bold', marginVertical: 4 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: { fontSize: 16, fontWeight: 'bold' },
  qtyText: { marginHorizontal: 12, fontSize: 14, fontWeight: 'bold' },
  removeIconButton: { position: 'absolute', top: 12, right: 12 },
  shippingBox: { padding: 16, borderRadius: 16, borderWidth: 1 },
  shippingBoxTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  cepInputRow: { flexDirection: 'row', alignItems: 'center' },
  cepInput: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    fontSize: 14,
  },
  addressText: { marginTop: 10, fontSize: 13, fontWeight: '600' },
  shippingOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  shippingOptionLeft: { flexDirection: 'row', alignItems: 'center' },
  shippingName: { fontSize: 14, fontWeight: '700' },
  shippingDelivery: { fontSize: 11, marginTop: 2 },
  shippingPriceText: { fontSize: 14, fontWeight: '800' },
  couponRow: { flexDirection: 'row', alignItems: 'center' },
  couponInput: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    fontSize: 14,
    marginRight: 10,
  },
  couponButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: 'center',
  },
  couponButtonText: { fontWeight: 'bold', fontSize: 14 },
  activeCouponText: { marginTop: 8, fontSize: 12, fontWeight: 'bold' },
  totalContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  subtotalLabel: { fontSize: 13, marginVertical: 2, fontWeight: '500' },
  totalLabel: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  totalValue: { fontSize: 24, fontWeight: '900', marginTop: 2 },
  // Histórico
  orderCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  orderDate: { fontSize: 14, fontWeight: '900' },
  orderSubDate: { fontSize: 11, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '800' },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLine: { flex: 1, height: 2 },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    flex: 1,
    textAlign: 'center',
  },
  orderDivider: { borderTopWidth: 1, marginVertical: 10 },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  orderItemName: { flex: 1, fontSize: 13, fontWeight: '600' },
  orderItemQty: { fontSize: 12, marginHorizontal: 10 },
  orderItemPrice: { fontSize: 13, fontWeight: '800' },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  orderShipping: { fontSize: 12 },
  orderTotal: { fontSize: 16, fontWeight: '900' },
  // Modais
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    flex: 1,
  },
  modalQuestionMark: { fontSize: 24, fontWeight: '900', marginHorizontal: 8 },
  modalText: { fontSize: 15, textAlign: 'center', marginBottom: 20 },
  modalInput: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalButtonText: { fontSize: 16, fontWeight: 'bold' },
  modalCancelButton: { marginTop: 12 },
  modalCancelButtonText: { fontSize: 14, fontWeight: '600' },
});