'use client';
/* eslint-disable */

import { ChatBody } from '@/types/types';
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Icon,
  Portal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { keyframes } from '@emotion/react';
import {
  FiSearch,
  FiBarChart2,
  FiMenu,
  FiFilter,
  FiClock,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiArrowLeft,
  FiMoreVertical,
  FiFolder,
  FiPlus,
} from 'react-icons/fi';
import { SearchBar } from '@/components/navbar/searchBar/SearchBar';

type StreamEvent = { step: string; payload: any };

const buildModelReasoning = (events: StreamEvent[]): string[] => {
  if (!Array.isArray(events) || events.length === 0) return [];

  const pickString = (...values: any[]) =>
    values.find((v) => typeof v === 'string' && v.trim().length > 0)?.trim();

  const pickNumber = (...values: any[]): number | null => {
    for (const val of values) {
      if (typeof val === 'number' && !Number.isNaN(val)) return val;
      if (typeof val === 'string' && val.trim() !== '' && !Number.isNaN(Number(val))) {
        return Number(val);
      }
    }
    return null;
  };

  const asList = (value: any) => (Array.isArray(value) ? value : null);

  const successValues = ['ok', 'success', 'completed', 'done', 'true'];
  const isSuccess = (val: any) => val === true || successValues.includes(String(val).toLowerCase());
  const hasSuccessText = (text?: string | null) => {
    if (!text || typeof text !== 'string') return false;
    const t = text.toLowerCase();
    return t.includes('exito') || t.includes('éxito') || t.includes('success') || t.includes('ok');
  };

  const lines: string[] = [];
  const stepLabel = (id: string) => {
    if (id.includes('triage')) return '**Intención:** ';
    if (id.includes('intent')) return '**Clasificación:** ';
    if (id.includes('schema')) return '**Priorización de tablas:** ';
    if (id.includes('sql_generation')) return '**Generación SQL:** ';
    if (id.includes('sql_execution')) return '**Ejecución SQL:** ';
    if (id.includes('verification')) return '**Verificación:** ';
    if (id.includes('visualization') || id.includes('viz')) return '**Visualización (Power BI):** ';
    if (id.includes('graph')) return '**Renderización de gráfica:** ';
    if (id.includes('format')) return '**Consolidación de respuesta:** ';
    if (id.includes('complete')) return '**Finalización:** ';
    if (id.includes('error')) return '**Error:** ';
    return '**Paso adicional:** ';
  };

  events.forEach((ev) => {
    if (!ev) return;
    const rawPayload = ev.payload || {};
    const payload = rawPayload.result || rawPayload.payload || rawPayload;
    const identifier = `${ev.step || ''} ${rawPayload?.type || ''} ${rawPayload?.name || ''}`
      .toLowerCase()
      .trim();
    const addLine = (text?: string) => {
      if (text && text.trim().length > 0) {
        lines.push(text.trim());
      }
    };

    if (identifier.includes('triage')) {
      const reasoning =
        pickString(payload?.reasoning, payload?.resumen, payload?.summary, payload?.detalle) || '';
      if (reasoning) {
        const firstSentence = reasoning.split(/[.;]/)[0].trim();
        const simplified = firstSentence.replace(/\s+/g, ' ').trim();
        addLine(stepLabel(identifier) + simplified);
      } else {
        const classification =
          pickString(payload?.query_type, payload?.category, payload?.categoria, payload?.domain, payload?.area) || '';
        const line = classification
          ? `Se clasificó la consulta como ${classification}.`
          : 'Se clasificó la consulta.';
        addLine(stepLabel(identifier) + line);
      }
      return;
    }

    if (identifier.includes('intent')) {
      const tipoPatron = pickString(payload?.tipo_patron, payload?.patron, payload?.pattern, payload?.tipo);
      const label = stepLabel(identifier);
      if (tipoPatron) {
        addLine(label + `Se identificó que el patrón analítico es de ${tipoPatron}.`);
      } else {
        addLine(label + 'Se identificó la intención de la consulta.');
      }
      return;
    }

    if (identifier.includes('schema')) {
      const tables =
        asList(payload?.tablas_priorizadas) ||
        asList(payload?.tablas) ||
        asList(payload?.tables) ||
        asList(payload?.prioritized_tables) ||
        asList(payload?.tablas_prioritizadas);
      if (tables && tables.length > 0) {
        addLine(stepLabel(identifier) + `Se priorizaron las siguientes tablas para construir la respuesta: ${tables.join(', ')}.`);
      } else {
        addLine(stepLabel(identifier) + 'Se priorizaron las tablas relevantes para construir la respuesta.');
      }
      return;
    }

    if (identifier.includes('sql_generation')) {
      const sql =
        pickString(
          payload?.sql,
          payload?.query,
          payload?.consulta,
          payload?.generated_sql,
          payload?.sql_query,
        ) || '';
      if (sql) {
        addLine(stepLabel(identifier) + `Se generó la siguiente consulta SQL para responder la pregunta: ${sql}`);
      } else {
        addLine(stepLabel(identifier) + 'Se generó la consulta SQL para responder la pregunta.');
      }
      return;
    }

    if (identifier.includes('verification')) {
      const verificationMsg =
        pickString(payload?.message, payload?.detalle, payload?.descripcion, payload?.reason, payload?.resumen) || '';
      if (isSuccess(payload?.success) || isSuccess(payload?.ok) || isSuccess(payload?.status)) {
        addLine(stepLabel(identifier) + 'La consulta fue verificada correctamente');
      } else if (verificationMsg) {
        addLine(stepLabel(identifier) + `Durante la verificación se encontraron los siguientes puntos: ${verificationMsg}`);
      } else {
        addLine(stepLabel(identifier) + 'Se realizó una verificación de la consulta.');
      }
      return;
    }

    if (identifier.includes('sql_execution')) {
      const totalFilas = pickNumber(
        payload?.total_filas,
        payload?.total_rows,
        payload?.row_count,
        payload?.count,
        payload?.num_rows,
      );
      const execMsg =
        pickString(payload?.error, payload?.errorMessage, payload?.descripcion, payload?.detalle, payload?.reason) || '';
      const successText = pickString(
        payload?.message,
        payload?.resumen,
        payload?.summary,
        payload?.status,
        payload?.state?.status,
      );
      const successFlag =
        isSuccess(payload?.success) ||
        isSuccess(payload?.ok) ||
        isSuccess(payload?.status) ||
        hasSuccessText(successText);

      if (successFlag) {
        let line = 'La ejecución de la consulta fue exitosa.';
        if (totalFilas !== null) {
          line += ` Se devolvieron ${totalFilas} filas`;
        }
        addLine(stepLabel(identifier) + line);
      } else if (execMsg) {
        addLine(stepLabel(identifier) + `La ejecución de la consulta presentó un error: ${execMsg}.`);
      } else {
        addLine(stepLabel(identifier) + 'La ejecución de la consulta se completó, pero no se dispone de más detalle.');
      }
      return;
    }

    if (identifier.includes('visualization') || identifier.includes('viz')) {
      const tipoGrafico =
        pickString(
          payload?.tipo_grafico,
          payload?.chart_type,
          payload?.visual_hint,
          payload?.graph_type,
          payload?.viz_type,
        ) || '';
      let line = tipoGrafico
        ? `Se generó el enlace de Power BI para una gráfica tipo ${tipoGrafico}.`
        : 'Se generó el enlace de Power BI para la gráfica.';
      addLine(stepLabel(identifier) + line);
      return;
    }

    if (identifier.includes('graph')) {
      const statusText =
        pickString(payload?.status, payload?.state?.status, payload?.mensaje, payload?.message) || '';
      if (statusText) {
        addLine(stepLabel(identifier) + `Se renderizó la gráfica en el panel de resultados (${statusText}).`);
      } else {
        addLine(stepLabel(identifier) + 'Se renderizó la gráfica en el panel de resultados.');
      }
      return;
    }

    if (identifier.includes('format')) {
      addLine(stepLabel(identifier) + 'Se consolidó la respuesta final para el usuario.');
      return;
    }

    if (identifier.includes('complete')) {
      addLine(stepLabel(identifier) + 'Ejecución global finalizada correctamente.');
      return;
    }

    if (identifier.includes('error')) {
      const errMsg =
        pickString(
          payload?.error,
          payload?.message,
          payload?.detalle,
          payload?.descripcion,
          payload?.reason,
        ) || '';
      addLine(stepLabel(identifier) + (errMsg ? `Ejecución global finalizada con error: ${errMsg}` : 'Ejecución global finalizada con error.'));
      return;
    }

    addLine(stepLabel(identifier) + 'El agente realizó un paso adicional de procesamiento.');
  });

  return lines;
};

const isWorkflowComplete = (events: StreamEvent[]): boolean => {
  if (!Array.isArray(events) || events.length === 0) return false;
  const completionKeywords = ['complete', 'completed', 'done', 'finished', 'success', 'ok'];

  return events.some((ev) => {
    if (!ev) return false;
    const step = String(ev.step || '').toLowerCase();
    const rawPayload = ev.payload || {};
    const payload = rawPayload.result || rawPayload.payload || rawPayload;
    if (completionKeywords.includes(step)) return true;
    const status = String(payload?.status || payload?.state?.status || '').toLowerCase();
    if (completionKeywords.includes(status)) return true;
    return false;
  });
};

export default function Chat() {
  const [inputCode, setInputCode] = useState<string>('');
  const [history, setHistory] = useState<
    Array<{ question: string; formatted: any; reasoning?: string; events?: StreamEvent[] }>
  >([]);
  const [streamEvents, setStreamEvents] = useState<StreamEvent[]>([]);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'chat' | 'reports'>('chat');
  const [reportsQuery, setReportsQuery] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchMatches, setSearchMatches] = useState<HTMLElement[]>([]);
  const [activeMatchIndex, setActiveMatchIndex] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const thinkingWords = ['Pensando', 'Analizando', 'Consultando', 'Procesando'];
  const [thinkingIndex, setThinkingIndex] = useState<number>(0);
  const [dots, setDots] = useState<string>('');
  const fadeInUp = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  useEffect(() => {
    const container = document.getElementById('chat-scroll-container');
    if (!container) return;
    const onScroll = () => {
      const distance = container.scrollHeight - container.scrollTop - container.clientHeight;
      const nearBottom = distance < 160;
      if (nearBottom) {
        setAutoScrollEnabled(true);
        setShowNewAnswerPrompt(false);
      } else {
        setAutoScrollEnabled(false);
      }
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  // Projects State
  const [projects, setProjects] = useState<any[]>([]);
  const [projectItems, setProjectItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [selectedGraphToAdd, setSelectedGraphToAdd] = useState<{ url: string; type: string; title?: string } | null>(null);
  const streamRef = useRef<HTMLDivElement | null>(null);
  const streamEndRef = useRef<HTMLDivElement | null>(null);
  const streamingStoppedRef = useRef<boolean>(false);
  const latestQuestionRef = useRef<HTMLDivElement | null>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [showNewAnswerPrompt, setShowNewAnswerPrompt] = useState<boolean>(false);
  const isStreamingActive = loading && streamEvents.length > 0 && !isWorkflowComplete(streamEvents);

  // Modal State
  const {
    isOpen: isProjectModalOpen,
    onOpen: onProjectModalOpen,
    onClose: onProjectModalClose
  } = useDisclosure();

  // Form State
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ title: '', description: '' });

  const toast = useToast();

  useEffect(() => {
    if (!loading) {
      setThinkingIndex(0);
      setDots('');
      return;
    }
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) {
          setThinkingIndex((idx) => (idx + 1) % thinkingWords.length);
          return '';
        }
        return prev + '.';
      });
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  // Load projects from Backend on startup
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.error("Error fetching projects", e);
    }
  };

  const handleOpenAddToProject = (url: string, type: string, title?: string) => {
    setSelectedGraphToAdd({ url, type, title });
    setIsCreatingProject(false);
    onProjectModalOpen();
  };

  const handleAddToProject = async (projectId: string) => {
    if (!selectedGraphToAdd) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedGraphToAdd.type,
          content: selectedGraphToAdd.url,
          title: selectedGraphToAdd.title || 'Nueva gráfica',
        })
      });

      if (res.ok) {
        toast({ title: 'Gráfica guardada exitosamente.', status: 'success', duration: 3000 });
        onProjectModalClose();
      } else {
        toast({ title: 'Error al guardar.', status: 'error' });
      }
    } catch (e) {
      toast({ title: 'Error de conexión.', status: 'error' });
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectData.title) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProjectData.title,
          description: newProjectData.description,
          owner: 'Andres Leon'
        })
      });

      if (res.ok) {
        const newProject = await res.json();
        setProjects(prev => [newProject, ...prev]);
        handleAddToProject(newProject.id);
      }
    } catch (e) {
      toast({ title: 'Error al crear proyecto.', status: 'error' });
    }
  };

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const brandColor = '#0F4C9B';
  const textColor = useColorModeValue('navy.700', 'white');
  const questionBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const bubbleTailColor = useColorModeValue('#F7FAFC', 'rgba(255,255,255,0.08)');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const reportsSearchBorder = useColorModeValue('#d7ddff', '#334');
  const hasHistory = history.length > 0;

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const clearHighlights = () => {
    if (!contentRef.current) return;
    const highlighted = Array.from(
      contentRef.current.querySelectorAll('span[data-search-highlight="true"]'),
    );
    highlighted.forEach((span) => {
      const parent = span.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(span.textContent || ''), span);
      parent.normalize();
    });
  };

  const applyHighlights = (term: string) => {
    if (!contentRef.current || !term.trim()) return;
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'ig');
    const walker = document.createTreeWalker(contentRef.current, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const parentEl = node.parentElement;
      if (parentEl && parentEl.closest('[data-searchable="true"]')) {
        textNodes.push(node);
      }
    }

    textNodes.forEach((textNode) => {
      const text = textNode.data;
      if (!regex.test(text)) {
        regex.lastIndex = 0;
        return;
      }
      regex.lastIndex = 0;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        const start = match.index;
        const end = regex.lastIndex;
        if (start > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
        }
        const span = document.createElement('span');
        span.textContent = text.slice(start, end);
        span.setAttribute('data-search-highlight', 'true');
        span.style.backgroundColor = '#e8f1ff';
        span.style.borderRadius = '4px';
        span.style.padding = '0 2px';
        fragment.appendChild(span);
        lastIndex = end;
      }
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      textNode.replaceWith(fragment);
    });
  };

  const refreshHighlights = (term: string) => {
    clearHighlights();
    if (term.trim()) {
      applyHighlights(term);
    }
  };

  const normalizeText = (s: string) =>
    (s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  const normalizedQuery = normalizeText(reportsQuery);
  const filteredProjects = normalizedQuery
    ? projects.filter((item) => normalizeText(item.title).includes(normalizedQuery))
    : projects;

  const recomputeMatches = (term: string) => {
    if (!contentRef.current) return;
    refreshHighlights(term);
    if (!term.trim()) {
      setSearchMatches([]);
      setActiveMatchIndex(0);
      return;
    }
    const matches = Array.from(
      contentRef.current.querySelectorAll('span[data-search-highlight="true"]'),
    ) as HTMLElement[];
    setSearchMatches(matches);
    setActiveMatchIndex(matches.length > 0 ? 0 : 0);
    if (matches.length > 0) {
      matches[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSearchChange = (e: any) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (activeView === 'chat') {
      recomputeMatches(term);
    }
  };

  const handleSearchKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      goToMatch(1);
    }
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchMatches([]);
    setActiveMatchIndex(0);
    refreshHighlights('');
  };

  const goToMatch = (step: number) => {
    if (searchMatches.length === 0) return;
    const nextIndex = (activeMatchIndex + step + searchMatches.length) % searchMatches.length;
    setActiveMatchIndex(nextIndex);
    searchMatches[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const getScrollableParent = (el: HTMLElement | null): HTMLElement | null => {
    let node: HTMLElement | null = el;
    while (node) {
      const style = window.getComputedStyle(node);
      const canScrollY = /(auto|scroll)/.test(style.overflowY || style.overflow || '');
      if (canScrollY && node.scrollHeight > node.clientHeight + 1) {
        return node;
      }
      node = node.parentElement;
    }
    return document.scrollingElement as HTMLElement | null;
  };

  const scrollToBottom = () => {
    const scrollable =
      document.getElementById('chat-scroll-container') ||
      (document.scrollingElement as HTMLElement | null) ||
      document.documentElement;
    const anchor = streamEndRef.current;
    const isDocument =
      scrollable === document.body ||
      scrollable === document.documentElement ||
      scrollable === document.scrollingElement;

    if (anchor && scrollable) {
      const anchorRect = anchor.getBoundingClientRect();
      const containerRect = scrollable.getBoundingClientRect();
      const offset = 90; // espacio controlado para no tapar con el input fijo
      const delta = anchorRect.bottom - containerRect.bottom + offset;

      const currentTop = isDocument ? window.scrollY : scrollable.scrollTop;
      const targetTop = Math.max(0, currentTop + delta);
      const opts: ScrollToOptions = { top: targetTop, behavior: 'smooth' };

      if (isDocument) {
        window.scrollTo(opts);
      } else {
        scrollable.scrollTo(opts);
      }
      setShowNewAnswerPrompt(false);
      setAutoScrollEnabled(true);
      return;
    }

    // Fallback a scroll completo
    const opts: ScrollToOptions = { top: scrollable.scrollHeight, behavior: 'smooth' };
    if (isDocument) {
      window.scrollTo(opts);
    } else {
      scrollable.scrollTo(opts);
    }
  };

  const handleTranslate = async () => {
    const maxCodeLength = 700;
    if (!inputCode) {
      alert('Please enter your message.');
      return;
    }
    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    const currentMessage = inputCode;
    setHistory((prev) => [...prev, { question: currentMessage, formatted: null, reasoning: '', events: [] }]);
    setInputCode('');
    setStreamEvents([]);
    streamingStoppedRef.current = false;
    latestQuestionRef.current = null;
    setAutoScrollEnabled(true);
    setShowNewAnswerPrompt(false);
    setLoading(true);

    const controller = new AbortController();
    const streamUrl =
      process.env.NEXT_PUBLIC_BACKEND_STREAM_URL?.trim() ||
      'http://127.0.0.1:8000/api/chat/stream';

    try {
      const payload = { message: currentMessage, user_id: 'anonymous' };
      const response = await fetch(streamUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.body) {
        const rawText = await response.text();
        setHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].formatted = { error: rawText || 'No se pudo abrir el stream.' };
          return updated;
        });
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalFormatted: any = null;
      const collectedEvents: StreamEvent[] = [];

      const processBuffer = (buf: string) => {
        const normalized = buf.replace(/\r\n/g, '\n');
        const parts = normalized.split('\n\n');
        const remainder = parts.pop() || '';
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;
          const jsonStr = line.replace(/^data:\s*/, '');
          try {
            const evt = JSON.parse(jsonStr);
            collectedEvents.push({ step: evt.step || evt.type, payload: evt });
            setStreamEvents([...collectedEvents]);
            if ((evt.step || evt.type) === 'complete') {
              streamingStoppedRef.current = true;
              finalFormatted =
                evt?.result?.formatted_response ||
                evt?.result?.formattedResponse ||
                evt?.result ||
                evt?.payload ||
                evt?.response ||
                evt?.message ||
                null;
            }
          } catch {
            /* ignore */
          }
        }
        return remainder;
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        buffer = processBuffer(buffer);
      }
      if (buffer.trim().length > 0) buffer = processBuffer(buffer);

      if (!finalFormatted && collectedEvents.length > 0) {
        const last = collectedEvents[collectedEvents.length - 1].payload;
        finalFormatted =
          last?.result?.formatted_response ||
          last?.result?.formattedResponse ||
          last?.result ||
          last?.payload ||
          last?.response ||
          last?.message ||
          null;
      }

      if (!finalFormatted) {
        setHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].formatted = { error: 'El stream no devolvió respuesta final.' };
          return updated;
        });
        setLoading(false);
        return;
      }

      setHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].formatted = finalFormatted;
        updated[updated.length - 1].events = [...collectedEvents];
        updated[updated.length - 1].reasoning = buildModelReasoning(collectedEvents).join('\n');
        return updated;
      });
      setLoading(false);
    } catch (error) {
      setHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].formatted = {
          error: error instanceof Error ? error.message : 'Error procesando el stream',
        };
        return updated;
      });
      setLoading(false);
    }
  };

  const handleChange = (e: any) => setInputCode(e.target.value);

  const fetchProjectItems = async (projectId: string) => {
    setLoadingItems(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/items`);
      if (res.ok) {
        const data = await res.json();
        setProjectItems(data);
      } else {
        setProjectItems([]);
      }
    } catch (e) {
      console.error("Error fetching project items", e);
      setProjectItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleSelectReport = (report: any) => {
    setSelectedReport(report);
    setProjectItems([]); // Clear previous items
    fetchProjectItems(report.id); // Fetch items for this project
    window?.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    if (streamingStoppedRef.current) return;
    const lastEvent = streamEvents[streamEvents.length - 1];
    const lastStep = String(lastEvent?.step || '').toLowerCase();
    if (lastStep.includes('complete')) return;
    if (!isStreamingActive) return;
    if (!autoScrollEnabled) return;
    requestAnimationFrame(scrollToBottom);
  }, [streamEvents, isStreamingActive, autoScrollEnabled]);

  useEffect(() => {
    // Do not auto-move user after completion; only show prompt
  }, [loading]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    if (activeView !== 'chat') {
      clearSearch();
    }
  }, [activeView]);

  return (
    <Flex
      w="100%"
      h="100vh"
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      pt={{ base: '110px', md: '110px' }}
      direction="row"
      overflow="hidden"
    >
      {activeView === 'chat' && (
        <Portal>
          <Flex
            position="fixed"
            top="24px"
            right={{ base: '16px', md: '40px' }}
            zIndex="2000"
            gap="8px"
            align="center"
          >
            <SearchBar
              borderRadius="36px"
              w={{ base: '260px', md: '360px' }}
              size="lg"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              inputRef={searchInputRef}
              placeholder="Buscar"
            />
            {searchTerm && (
              <Flex
                align="center"
                gap="4px"
                bg="white"
                borderRadius="30px"
                boxShadow="sm"
                px="6px"
                py="4px"
              >
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => goToMatch(-1)}
                  isDisabled={searchMatches.length === 0}
                  leftIcon={<FiChevronLeft />}
                >
                  Prev
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => goToMatch(1)}
                  isDisabled={searchMatches.length === 0}
                  rightIcon={<FiChevronRight />}
                >
                  Next
                </Button>
                <Text fontSize="xs" color="gray.600">
                  {searchMatches.length > 0
                    ? `${activeMatchIndex + 1}/${searchMatches.length}`
                    : '0/0'}
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={clearSearch}
                  isDisabled={!searchTerm}
                  leftIcon={<FiX />}
                >
                  Limpiar
                </Button>
              </Flex>
            )}
          </Flex>
        </Portal>
      )}

      {/* Sidebar estilo Canva */}
      <Flex
        position="fixed"
        top="90px"
        left="0"
        h="calc(100vh - 90px)"
        pt="24px"
        pb="24px"
        direction="column"
        align="center"
        gap="12px"
        bg={useColorModeValue('linear-gradient(180deg, #f5f3ff 0%, #f0f4ff 100%)', 'navy.900')}
        w={sidebarExpanded ? '200px' : '72px'}
        transition="width 0.2s ease"
        borderRight="1px solid"
        borderColor={borderColor}
        zIndex="120"
      >
        <Button
          onClick={() => setSidebarExpanded((s) => !s)}
          variant="ghost"
          leftIcon={<FiMenu />}
          w={sidebarExpanded ? '160px' : '48px'}
          justifyContent={sidebarExpanded ? 'flex-start' : 'center'}
          borderRadius="full"
          px={sidebarExpanded ? 4 : 0}
          color={textColor}
        _hover={{ bg: useColorModeValue('white', 'whiteAlpha.200') }}
      >
        {sidebarExpanded ? 'Menú' : ''}
      </Button>
      <Button
        leftIcon={<FiSearch />}
        variant="ghost"
        w={sidebarExpanded ? '160px' : '48px'}
        justifyContent={sidebarExpanded ? 'flex-start' : 'center'}
        borderRadius="full"
        px={sidebarExpanded ? 4 : 0}
        color={textColor}
        _hover={{ bg: useColorModeValue('white', 'whiteAlpha.200') }}
        onClick={() => setActiveView('chat')}
        bg={activeView === 'chat' ? useColorModeValue('white', 'whiteAlpha.200') : 'transparent'}
      >
        {sidebarExpanded ? 'Consultar' : ''}
      </Button>
      <Button
        leftIcon={<FiBarChart2 />}
        variant="ghost"
        w={sidebarExpanded ? '160px' : '48px'}
        justifyContent={sidebarExpanded ? 'flex-start' : 'center'}
        borderRadius="full"
        px={sidebarExpanded ? 4 : 0}
        color={textColor}
        _hover={{ bg: useColorModeValue('white', 'whiteAlpha.200') }}
        onClick={() => setActiveView('reports')}
        bg={activeView === 'reports' ? useColorModeValue('white', 'whiteAlpha.200') : 'transparent'}
      >
        {sidebarExpanded ? 'Proyectos' : ''}
      </Button>
        <Flex
          mt="auto"
          w="100%"
          direction="row"
          align="center"
          justify="center"
          gap="10px"
          pb="12px"
        >
          <Box
            w="48px"
            h="48px"
            borderRadius="full"
            bg={brandColor}
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="700"
            fontSize="sm"
            boxShadow="0 8px 20px rgba(15, 76, 155, 0.18)"
          >
            AL
          </Box>
          {sidebarExpanded && (
            <Text color={textColor} fontWeight="700" fontSize="sm" textAlign="left">
              Andres Leon
            </Text>
          )}
        </Flex>
    </Flex>

      {/* Main scrollable area */}
      <Flex
        direction="column"
        flex="1"
        w="100%"
      minH="0"
      overflowY="auto"
      overflowX="hidden"
      sx={{ scrollBehavior: 'smooth' }}
      display={activeView === 'reports' || hasHistory ? 'flex' : 'none'}
      pb={{ base: '110px', md: '100px' }}
      pl={sidebarExpanded ? '220px' : '120px'}
      pr={{ base: 4, md: 6 }}
      alignItems={activeView === 'chat' ? 'center' : 'flex-start'}
      border="none"
      outline="none"
      boxShadow="none"
      ref={contentRef}
      id="chat-scroll-container"
    >
        <Flex
        direction="column"
        w="100%"
        maxW={activeView === 'chat' ? '840px' : 'unset'}
        mx={activeView === 'chat' ? 'auto' : '0'}
        mb="8px"
        border="none"
        outline="none"
        boxShadow="none"
      >
          <Flex w="100%" direction="column" gap="20px">
            {activeView === 'reports' ? (
              <Box w="100%" pt="20px" pb="40px">
                {!selectedReport && (
                  <Box mb="16px" display="flex" flexDir="column" alignItems="center">
                    <Text fontSize="3xl" fontWeight="800" color={textColor} mb="12px" textAlign="center">
                      Todos los proyectos
                    </Text>
                    <Flex
                      align="center"
                      bg="white"
                      borderRadius="32px"
                      px={{ base: '14px', md: '18px' }}
                      py={{ base: '10px', md: '12px' }}
                      boxShadow="0 8px 20px rgba(15, 76, 155, 0.12)"
                      border="1px solid"
                      borderColor={reportsSearchBorder}
                      w="100%"
                      maxW="720px"
                      gap="10px"
                      mx="auto"
                    >
                      <Icon as={FiSearch} color={brandColor} w="20px" h="20px" />
                      <Input
                        placeholder="Buscar en todos los proyectos"
                        border="none"
                        _focus={{ boxShadow: 'none' }}
                        fontSize="md"
                        color={textColor}
                        value={reportsQuery}
                        onChange={(e) => setReportsQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setReportsQuery('');
                          }
                        }}
                      />
                    </Flex>
                  </Box>
                )}

                {normalizedQuery && !selectedReport && (
                  <Box
                    mt="8px"
                    px="12px"
                    py="8px"
                    bg="rgba(15,76,155,0.04)"
                    borderRadius="12px"
                    border="1px dashed"
                    borderColor={reportsSearchBorder}
                    w="100%"
                    maxW="720px"
                    mx="auto"
                  >
                    <Text fontSize="sm" color="gray.600">
                      Mostrando resultados para "{reportsQuery}"
                    </Text>
                  </Box>
                )}

                {filteredProjects.length === 0 && normalizedQuery && !selectedReport ? (
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    w="100%"
                    py="32px"
                    gap="10px"
                    color="gray.500"
                  >
                    <Icon as={FiSearch} w="32px" h="32px" color="gray.400" />
                    <Text fontWeight="700" color={textColor} textAlign="center">
                      No encontramos resultados para "{reportsQuery}"
                    </Text>
                  </Flex>
                ) : null}

                {!selectedReport && (
                  <Box mt="20px">
                    <Text fontSize="xl" fontWeight="700" color={textColor} mb="12px">
                      Proyectos
                    </Text>
                    <Flex mt="12px" gap="16px" flexWrap="wrap">
                      {filteredProjects.length === 0 ? (
                        <Text color="gray.500">No hay proyectos. Crea uno desde el chat.</Text>
                      ) : (
                        filteredProjects.map((item) => (
                          <Box
                            key={item.id}
                            w={{ base: '100%', sm: '260px' }}
                            bg="white"
                            borderRadius="16px"
                            border="1px solid"
                            borderColor={borderColor}
                            boxShadow="0 8px 20px rgba(15, 76, 155, 0.12)"
                            p="16px"
                            cursor="pointer"
                            _hover={{ transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(15, 76, 155, 0.18)' }}
                            transition="all 0.15s ease"
                            onClick={() => handleSelectReport(item)}
                          >
                            <Flex align="center" justify="space-between" mb="10px">
                              <Icon as={FiFileText} color={brandColor} w="20px" h="20px" />
                              {item.created_at && (
                                <Flex align="center" color="gray.500" fontSize="xs" gap="6px">
                                  <Icon as={FiClock} w="14px" h="14px" />
                                  <Text>{new Date(item.created_at).toLocaleDateString('es-ES')}</Text>
                                </Flex>
                              )}
                            </Flex>
                            <Text fontWeight="700" color={textColor} mb="6px">
                              {item.title}
                            </Text>
                            <Text color="gray.600" fontSize="sm" mb="10px">
                              {item.description || 'Sin descripción'}
                            </Text>
                            <Text color="gray.600" fontSize="sm" fontWeight="600">
                              Propietario: {item.owner || 'Sin asignar'}
                            </Text>
                          </Box>
                        ))
                      )}
                    </Flex>
                  </Box>
                )}

                {selectedReport && (
                  <Box
                    mt="12px"
                    bg="white"
                    borderRadius="16px"
                    boxShadow="0 12px 30px rgba(15, 76, 155, 0.12)"
                    p={{ base: 4, md: 6 }}
                  >
                    <Flex align="center" mb="12px" gap="12px">
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<FiArrowLeft />}
                        onClick={() => {
                          setSelectedReport(null);
                          setProjectItems([]);
                        }}
                      >
                        Volver
                      </Button>
                      <Text fontSize="2xl" fontWeight="800" color={textColor}>
                        {selectedReport.title}
                      </Text>
                    </Flex>
                    <Text color="gray.600" mb="8px">
                      {selectedReport.description || 'Sin descripción'}
                    </Text>
                    <Text color="gray.600" fontWeight="600" mb="16px">
                      Propietario: {selectedReport.owner || 'Sin asignar'}
                    </Text>

                    {/* Grid de gráficas */}
                    {loadingItems ? (
                      <Flex justify="center" align="center" py="40px">
                        <Text color="gray.500">Cargando gráficas...</Text>
                      </Flex>
                    ) : projectItems.length === 0 ? (
                      <Box
                        w="100%"
                        py="60px"
                        border="1px dashed"
                        borderColor={reportsSearchBorder}
                        borderRadius="16px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg="gray.50"
                      >
                        <Text color="gray.500" fontWeight="600">
                          No hay gráficas en este proyecto. Agrega una desde el chat.
                        </Text>
                      </Box>
                    ) : (
                      <Box
                        display="grid"
                        gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                        gap="16px"
                        w="100%"
                      >
                        {projectItems.map((item) => (
                          <Box
                            key={item.id}
                            border="1px solid"
                            borderColor={borderColor}
                            borderRadius="12px"
                            overflow="hidden"
                            bg="white"
                            boxShadow="0 4px 12px rgba(15, 76, 155, 0.08)"
                            _hover={{ boxShadow: '0 8px 20px rgba(15, 76, 155, 0.15)' }}
                            transition="all 0.2s ease"
                          >
                            <Box p="12px" borderBottom="1px solid" borderColor={borderColor} bg="gray.50">
                              <Flex align="center" gap={2}>
                                <Icon as={FiBarChart2} color={brandColor} />
                                <Text fontWeight="600" fontSize="sm" color={textColor} noOfLines={1}>
                                  {item.title || 'Gráfica'}
                                </Text>
                              </Flex>
                              {item.created_at && (
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                  {new Date(item.created_at).toLocaleDateString('es-ES')}
                                </Text>
                              )}
                            </Box>
                            <Box
                              as="iframe"
                              src={item.content}
                              width="100%"
                              height="280px"
                              border="none"
                            />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ) : (
              history.map((item, idx) => {
              const isLatest = idx === history.length - 1;
              const eventsForReasoning =
                isLatest && item.formatted === null ? streamEvents : item.events || [];
              const workflowComplete = isWorkflowComplete(eventsForReasoning);
              const reasoningList = workflowComplete ? buildModelReasoning(eventsForReasoning) : [];
              const hasReasoning = reasoningList.length > 0;
              const shouldShowReasoningPanel = workflowComplete;

              return (
                <Box
                  key={`hist-${idx}`}
                  w="100%"
                  borderRadius="16px"
                  p="6px"
                  data-searchable="true"
                >
                  {/* Question bubble */}
                  <Flex w="100%" justify="flex-end" mb="12px">
                    <Box
                      ref={isLatest ? latestQuestionRef : undefined}
                      maxW="70%"
                      p="16px 20px"
                      borderRadius="14px"
                      border="1px solid"
                      borderColor={borderColor}
                      bg={questionBg}
                      position="relative"
                      _after={{
                        content: "''",
                        position: 'absolute',
                        right: '-12px',
                        top: '18px',
                        width: '0',
                        height: '0',
                        borderTop: '10px solid transparent',
                        borderBottom: '10px solid transparent',
                        borderLeft: `12px solid ${bubbleTailColor}`,
                      }}
                      data-searchable="true"
                    >
                      <Text color={textColor} fontWeight="700" fontSize={{ base: 'sm', md: 'md' }} lineHeight={{ base: '22px', md: '24px' }}>
                        {item.question}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex w="100%" direction="column" gap="10px">
                    {/* Progress while streaming */}
                    {item.formatted === null && isLatest && streamEvents.length > 0 && (
                      <Box border="1px solid" borderColor={borderColor} borderRadius="12px" p="12px" bg={questionBg}>
                        <Text fontWeight="700" color={textColor} mb="8px">Progreso</Text>
                        {(() => {
                          const normalizeType = (value?: string) =>
                            (value || '').toLowerCase().replace(/-/g, '_').trim();
                          const hasVisualization = streamEvents.some((e) => {
                            const id = normalizeType(e?.step || (e?.payload as any)?.type);
                            return id.includes('visualization') || id.includes('viz');
                          });
                          const expectedSteps = hasVisualization ? 10 : 8;
                          const progressValue = Math.min(
                            100,
                            Math.round(((streamEvents.length || 0) / expectedSteps) * 100),
                          );

                          const pickString = (...values: any[]) =>
                            values.find((v) => typeof v === 'string' && v.trim().length > 0)?.trim();
                          const asList = (value: any) => (Array.isArray(value) ? value : null);
                          const buildTitle = (identifier: string, index: number) => {
                            const id = normalizeType(identifier);
                            const base = `Paso ${index + 1} - `;
                            if (id.includes('triage')) return base + 'Intención de la consulta';
                            if (id.includes('intent')) return base + 'Clasificación de la consulta';
                            if (id.includes('schema')) return base + 'Selección de tablas relevantes';
                            if (id.includes('sql_generation')) return base + 'Generación de la consulta SQL';
                            if (id.includes('sql_execution')) return base + 'Ejecución de la consulta SQL';
                            if (id.includes('verification')) return base + 'Verificación de la consulta';
                            if (id.includes('visualization') || id.includes('viz')) return base + 'Generación del link de Power BI';
                            if (id.includes('graph')) return base + 'Renderización de la gráfica';
                            if (id.includes('format')) return base + 'Consolidación de la respuesta';
                            if (id.includes('complete')) return base + 'Finalización';
                            if (id.includes('error')) return base + 'Error';
                            return base + 'Paso adicional';
                          };
                          const buildBody = (identifier: string, payload: any) => {
                            const id = normalizeType(identifier);
                            const successValuesLocal = ['ok', 'success', 'completed', 'done'];
                            const isSuccessLocal = (val: any) =>
                              val === true || successValuesLocal.includes(String(val).toLowerCase());
                            const hasSuccessTextLocal = (text?: string | null) => {
                              if (!text || typeof text !== 'string') return false;
                              const t = text.toLowerCase();
                              return t.includes('exito') || t.includes('éxito') || t.includes('success') || t.includes('ok');
                            };
                            const pickNumberLocal = (...values: any[]): number | null => {
                              for (const val of values) {
                                if (typeof val === 'number' && !Number.isNaN(val)) return val;
                                if (typeof val === 'string' && val.trim() !== '' && !Number.isNaN(Number(val))) {
                                  return Number(val);
                                }
                              }
                              return null;
                            };
                            const errorMsg =
                              pickString(
                                payload?.error,
                                payload?.errorMessage,
                                payload?.descripcion,
                                payload?.detail,
                                payload?.reason,
                                payload?.resumen,
                              ) || '';

                            if (id.includes('sql_generation')) {
                              return 'Se ha generado la consulta SQL';
                            }

                            if (id.includes('triage')) {
                              const reasoning =
                                pickString(payload?.reasoning, payload?.resumen, payload?.summary, payload?.detalle) || '';
                              if (reasoning) {
                                const firstSentence = reasoning.split(/[.;]/)[0].trim();
                                return firstSentence;
                              }
                              const classification =
                                pickString(payload?.category, payload?.categoria, payload?.domain, payload?.area) || '';
                              if (classification) return `Se clasificó la consulta como ${classification}.`;
                              return 'La consulta se ha clasificado';
                            }

                            if (id.includes('intent')) {
                              const tipoPatron = pickString(payload?.tipo_patron, payload?.patron, payload?.pattern, payload?.tipo);
                              if (tipoPatron) return `Se identificó que el patrón analítico es de ${tipoPatron}.`;
                              return 'Se identificó la intención de la consulta.';
                            }

                            if (id.includes('schema')) {
                              const tables =
                                asList(payload?.tablas_priorizadas) ||
                                asList(payload?.tablas) ||
                                asList(payload?.tables) ||
                                asList(payload?.prioritized_tables) ||
                                asList(payload?.tablas_prioritizadas);
                              if (tables && tables.length > 0) {
                                return `Las tablas priorizadas son: ${tables.join(', ')}`;
                              }
                              return 'Se han identificado y priorizado las tablas relevantes para la consulta';
                            }

                            if (id.includes('sql_generation')) {
                              const sql =
                                pickString(
                                  payload?.sql,
                                  payload?.query,
                                  payload?.consulta,
                                  payload?.generated_sql,
                                  payload?.sql_query,
                                ) || '';
                              if (sql) return `Se ha generado la consulta SQL`;
                              return 'El agente generó la consulta SQL para responder a la pregunta.';
                            }

                            if (id.includes('verification')) {
                              if (isSuccessLocal(payload?.success) || isSuccessLocal(payload?.ok) || isSuccessLocal(payload?.status)) {
                                return 'La consulta fue verificada correctamente';
                              }
                              if (errorMsg) {
                                return `Durante la verificación se encontraron problemas: ${errorMsg}`;
                              }
                              return 'Se ha verificado la consistencia de la consulta generada';
                            }

                            if (id.includes('sql_execution')) {
                              const totalFilas = pickNumberLocal(
                                payload?.total_filas,
                                payload?.total_rows,
                                payload?.row_count,
                                payload?.count,
                                payload?.num_rows,
                              );
                              const successText = pickString(
                                payload?.message,
                                payload?.resumen,
                                payload?.summary,
                                payload?.status,
                                payload?.state?.status,
                              );
                              const successFlag =
                                isSuccessLocal(payload?.success) ||
                                isSuccessLocal(payload?.ok) ||
                                isSuccessLocal(payload?.status) ||
                                hasSuccessTextLocal(successText);

                              if (successFlag) {
                                let line = 'La ejecución de la consulta fue exitosa.';
                                if (totalFilas !== null) {
                                  line += ` Se devolvieron ${totalFilas} filas`;
                                }
                                return line;
                              }
                              if (errorMsg) {
                                return `La ejecución de la consulta presentó un error: ${errorMsg}`;
                              }
                              return 'La ejecución de la consulta se completó, pero no se dispone de más detalle.';
                            }

                            if (id.includes('visualization') || id.includes('viz')) {
                              const tipoGrafico =
                                pickString(
                                  payload?.tipo_grafico,
                                  payload?.chart_type,
                                  payload?.visual_hint,
                                  payload?.graph_type,
                                  payload?.viz_type,
                                ) || '';
                              if (tipoGrafico) return `Se generó la visualización de tipo ${tipoGrafico}.`;
                              return 'Se generó la visualización de los resultados de la consulta.';
                            }

                            if (id.includes('graph')) {
                              return 'Se renderizó la gráfica en el panel de resultados.';
                            }

                            if (id.includes('format')) return 'Se consolidó la respuesta final para el usuario.';
                            if (id.includes('complete')) return 'Ejecución global finalizada correctamente.';
                            if (id.includes('error')) {
                              return errorMsg
                                ? `Ejecución global finalizada con error: ${errorMsg}`
                                : 'Ejecución global finalizada con error.';
                            }
                            return 'El agente reporta información adicional.';
                          };
                          const renderStep = (ev: { step: string; payload: any }, idxStep: number) => {
                            const rawPayload = ev.payload || {};
                            const payload = rawPayload.result || rawPayload.payload || rawPayload;
                            const identifier =
                              `${ev.step || ''} ${rawPayload?.type || ''} ${rawPayload?.name || ''}`.trim() || 'paso';
                            return (
                              <Box key={`${ev.step}-${idxStep}`} p="10px" borderRadius="10px" bg="white" border="1px solid" borderColor={borderColor} w="100%">
                                <Text fontWeight="700" color={textColor} mb="4px">
                                  {buildTitle(identifier, idxStep)}
                                </Text>
                                <Text color="gray.700" whiteSpace="pre-wrap">
                                  {buildBody(identifier, payload)}
                                </Text>
                              </Box>
                            );
                          };

                          return (
                            <>
                              <Progress value={progressValue} size="sm" mb="10px" w="100%" />
                              <Flex direction="column" gap="8px" w="100%" ref={streamRef}>
                                {streamEvents.length > 0 && (() => {
                                  const idxLast = streamEvents.length - 1;
                                  const lastEvent = streamEvents[idxLast];
                                  return (
                                    <Box key={`${lastEvent.step}-${idxLast}`} animation={`${fadeInUp} 300ms ease`}>
                                      {renderStep(lastEvent, idxLast)}
                                    </Box>
                                  );
                                })()}
                                <Box ref={streamEndRef} />
                              </Flex>
                            </>
                          );
                        })()}
                      </Box>
                    )}

                    {item.formatted === null && streamEvents.length === 0 && (
                      <Box>
                        <Text color="gray.500" fontStyle="italic">
                          {thinkingWords[thinkingIndex]}
                          {dots}
                        </Text>
                      </Box>
                    )}

                    {item.formatted?.error && (
                      <>
                        {!(item.formatted?.patron === 'NA' && item.formatted?.arquetipo === 'NA') && (
                          <Box>
                            <Text color={textColor}>
                              El patrón identificado es: {item.formatted?.patron || 'N/A'} y la pregunta es de arquetipo {item.formatted?.arquetipo || 'N/A'}
                            </Text>
                          </Box>
                        )}
                        <Box py="4px" px="12px" borderLeft="4px solid" borderColor="red.400">
                          <Text color="red.700">{item.formatted.error}</Text>
                        </Box>
                      </>
                    )}

                    {!item.formatted?.error && (
                      <>
                        {shouldShowReasoningPanel && (
                          <Box border="1px solid" borderColor={borderColor} borderRadius="12px" p="12px" bg={questionBg}>
                            <Flex align="center" justify="space-between" mb="8px">
                              <Text fontWeight="700" color={textColor}>
                                Razonamiento del modelo
                              </Text>
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() =>
                                  setExpandedReasoning((prev) => ({
                                    ...prev,
                                    [idx]: !prev[idx],
                                  }))
                                }
                              >
                                {expandedReasoning[idx] ? 'Ocultar' : 'Ver razonamiento'}
                              </Button>
                            </Flex>
                            {expandedReasoning[idx] && (
                              workflowComplete ? (
                                hasReasoning ? (
                                  <Flex direction="column">
                                    {reasoningList.map((line, lineIdx) => (
                                      (() => {
                                        const match = line.match(/^\*\*(.+?)\*\*\s*(.*)$/);
                                        const indexText = `${lineIdx + 1}. `;
                                        if (match) {
                                          const [, rawLabel, rest] = match;
                                          const label = rawLabel.replace(/:$/g, '');
                                          return (
                                            <Text
                                              key={`${idx}-reason-${lineIdx}`}
                                              color="gray.700"
                                              mt={lineIdx === 0 ? 0 : 2}
                                            >
                                              <Text as="span" fontWeight="700">
                                                {indexText}
                                              </Text>
                                              <Text as="span" fontWeight="700">
                                                {`${label}: `}
                                              </Text>
                                              {rest}
                                            </Text>
                                          );
                                        }
                                        return (
                                          <Text
                                            key={`${idx}-reason-${lineIdx}`}
                                            color="gray.700"
                                            mt={lineIdx === 0 ? 0 : 2}
                                          >
                                            <Text as="span" fontWeight="700">
                                              {indexText}
                                            </Text>
                                            {line}
                                          </Text>
                                        );
                                      })()
                                    ))}
                                  </Flex>
                                ) : (
                                  <Text color="gray.700">Aún no hay razonamiento disponible.</Text>
                                )
                              ) : (
                                <Text color="gray.700">El razonamiento estará disponible cuando el proceso finalice.</Text>
                              )
                            )}
                          </Box>
                        )}

                        {Array.isArray(item.formatted?.datos) && item.formatted.datos.length > 0 && (
                          <Box overflowX="auto">
                            <Table size="sm" variant="simple">
                              <Thead>
                                <Tr>
                                  {Object.keys(item.formatted.datos[0] || {}).map((key) => (
                                    <Th key={key} textTransform="capitalize">
                                      {key}
                                    </Th>
                                  ))}
                                </Tr>
                              </Thead>
                              <Tbody>
                                {item.formatted.datos.map((row: Record<string, any>, rowIdx: number) => (
                                  <Tr key={rowIdx}>
                                    {Object.keys(item.formatted.datos[0] || {}).map((key) => (
                                      <Td key={key}>
                                        {typeof row[key] === 'number'
                                          ? row[key].toLocaleString('es-MX')
                                          : String(row[key])}
                                      </Td>
                                    ))}
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </Box>
                        )}

                        {item.formatted?.insight && (
                          <Box>
                            <Text fontWeight="700" color={textColor} mb="6px">
                              Insight
                            </Text>
                            <Text color={textColor}>{item.formatted.insight}</Text>
                          </Box>
                        )}

                        {item.formatted?.html_url && (
                          <Box
                            border="1px solid"
                            borderColor={borderColor}
                            borderRadius="12px"
                            p="10px"
                            mt="10px"
                            bg="white"
                            position="relative"
                          >
                            <Flex justify="space-between" align="center" mb="8px" px="4px">
                              <Text fontWeight="700" color={textColor} fontSize="sm">
                                Gráfica Generada
                              </Text>

                              <Menu>
                                <MenuButton
                                  as={IconButton}
                                  icon={<FiMoreVertical />}
                                  variant="ghost"
                                  size="sm"
                                  aria-label="Opciones"
                                />
                                <MenuList>
                                  <MenuItem
                                    icon={<FiFolder />}
                                    onClick={() => handleOpenAddToProject(
                                      item.formatted.html_url,
                                      'html',
                                      item.formatted.insight || 'Gráfica analítica'
                                    )}
                                  >
                                    Agregar a proyecto
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </Flex>

                            <Box
                              as="iframe"
                              src={item.formatted.html_url}
                              width="100%"
                              height="400px"
                              border="none"
                              borderRadius="8px"
                            />
                          </Box>
                        )}

                        {item.formatted?.link_power_bi && (
                          <Box>
                            <Text fontWeight="700" color={textColor} mb="6px">
                              Power BI
                            </Text>
                            <a href={item.formatted.link_power_bi} target="_blank" rel="noreferrer">
                              <Text color={brandColor} textDecoration="underline">Ver reporte</Text>
                            </a>
                          </Box>
                        )}
                      </>
                    )}
                  </Flex>
                </Box>
              );
              })
            )}
          </Flex>
        </Flex>
      </Flex>

      {/* Chat input */}
      {activeView === 'chat' && (
        <Flex
          position="fixed"
          bottom="0"
          left={sidebarExpanded ? '180px' : '90px'}
          right="0"
          px={{ base: '12px', md: '24px' }}
          justify="center"
          zIndex="50"
        >
          <Flex
            w="100%"
            maxW="820px"
            bg="white"
            borderRadius="45px"
            boxShadow="0px 18px 30px -12px rgba(15, 76, 155, 0.15)"
            border="1px solid"
            borderColor={borderColor}
            align="center"
            px="10px"
            py="6px"
            gap="10px"
          >
            <Input
              flex="1"
              minH="54px"
              h="100%"
              border="none"
              _focus={{ borderColor: 'none', boxShadow: 'none' }}
              color={inputColor}
              _placeholder={placeholderColor}
              placeholder="Pregunta a Delfos"
              value={inputCode}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleTranslate();
                }
              }}
            />
            <Button
              bg={brandColor}
              color="white"
              py="16px"
              px="20px"
              fontSize="sm"
              borderRadius="40px"
              w={{ base: '120px', md: '160px' }}
              h="50px"
              _hover={{
                boxShadow: '0px 18px 30px -12px rgba(15, 76, 155, 0.45) !important',
                bg: '#0d3f81 !important',
                _disabled: { bg: brandColor },
              }}
              _active={{ bg: '#0b366f' }}
              onClick={handleTranslate}
              isLoading={loading ? true : false}
            >
              Enviar
            </Button>
          </Flex>
        </Flex>
      )}

      {showNewAnswerPrompt && (
        <Portal>
          <Box
            position="fixed"
            bottom="120px"
            right={{ base: '16px', md: '40px' }}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="0 10px 30px rgba(15, 76, 155, 0.12)"
            borderRadius="24px"
            px="14px"
            py="10px"
            display="flex"
            alignItems="center"
            gap="10px"
            zIndex={2100}
          >
            <Text color={textColor} fontWeight="700">Nueva respuesta</Text>
            <Button size="sm" colorScheme="blue" onClick={scrollToBottom}>
              Ver
            </Button>
          </Box>
        </Portal>
      )}

      {/* Project Modal */}
      <Modal isOpen={isProjectModalOpen} onClose={onProjectModalClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="white">
          <ModalHeader color="gray.800">Guardar en proyecto</ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody pb={6}>
            {!isCreatingProject ? (
              <VStack align="stretch" spacing={3}>
                <Button
                  leftIcon={<FiPlus />}
                  variant="outline"
                  colorScheme="blue"
                  w="100%"
                  onClick={() => setIsCreatingProject(true)}
                >
                  Crear nuevo proyecto
                </Button>

                <Text fontSize="sm" color="gray.600" mt={2} fontWeight="600">Sus proyectos:</Text>

                <Box maxH="300px" overflowY="auto">
                  {projects.length === 0 ? (
                    <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                      No hay proyectos. Crea uno nuevo.
                    </Text>
                  ) : (
                    projects.map((proj) => (
                      <Box
                        key={proj.id}
                        p="3"
                        mb="2"
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        cursor="pointer"
                        bg="gray.50"
                        _hover={{ bg: "blue.50", borderColor: "blue.400" }}
                        onClick={() => handleAddToProject(proj.id)}
                      >
                        <Flex align="center" gap={2}>
                          <Icon as={FiFolder} color="blue.500" />
                          <Text fontWeight="bold" fontSize="sm" color="gray.800">{proj.title}</Text>
                        </Flex>
                        {proj.description && <Text fontSize="xs" color="gray.600" mt={1}>{proj.description}</Text>}
                      </Box>
                    ))
                  )}
                </Box>
              </VStack>
            ) : (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel color="gray.700">Título</FormLabel>
                  <Input
                    value={newProjectData.title}
                    onChange={(e) => setNewProjectData({ ...newProjectData, title: e.target.value })}
                    color="gray.800"
                    bg="white"
                    borderColor="gray.300"
                    _placeholder={{ color: 'gray.400' }}
                    placeholder="Nombre del proyecto"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.700">Descripción</FormLabel>
                  <Input
                    value={newProjectData.description}
                    onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                    color="gray.800"
                    bg="white"
                    borderColor="gray.300"
                    _placeholder={{ color: 'gray.400' }}
                    placeholder="Descripción opcional"
                  />
                </FormControl>
                <Flex w="100%" gap={2}>
                  <Button flex="1" onClick={() => setIsCreatingProject(false)} variant="outline" colorScheme="gray">Cancelar</Button>
                  <Button flex="1" colorScheme="blue" onClick={handleCreateProject}>Guardar</Button>
                </Flex>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

