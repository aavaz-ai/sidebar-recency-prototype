"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  Button,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import ShareIcon from "@mui/icons-material/Share"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import SendIcon from "@mui/icons-material/Send"

const DRAWER_WIDTH = 280

type ChatGroup = "today" | "yesterday" | "last30days" | "older"
type AnimationMode = "fade" | "scroll-then-move" | "smart" | "teleport"

interface ChatItem {
  id: string
  title: string
  group: ChatGroup
}

const initialChats: ChatItem[] = [
  { id: "1", title: "Churn Analysis - Premium to Annu...", group: "today" },
  { id: "2", title: "Integration Complaints Last 90 Da...", group: "today" },
  { id: "3", title: "Q4 Revenue Forecast Model", group: "today" },
  { id: "4", title: "Customer Retention Strategy", group: "today" },
  { id: "5", title: "Product Roadmap Planning", group: "today" },
  { id: "6", title: "Taxonomy Management Feedback...", group: "yesterday" },
  { id: "7", title: "Dashboard User Sentiment Trends", group: "yesterday" },
  { id: "8", title: "Competitive Positioning Research", group: "yesterday" },
  { id: "9", title: "Mobile App Performance Review", group: "yesterday" },
  { id: "10", title: "Pricing Strategy Analysis", group: "yesterday" },
  { id: "11", title: "Sales Pipeline Optimization", group: "yesterday" },
  { id: "12", title: "Product Feature Prioritization Revi...", group: "last30days" },
  { id: "13", title: "User Experience Flow Evaluation", group: "last30days" },
  { id: "14", title: "Customer Feedback Synthesis", group: "last30days" },
  { id: "15", title: "Marketing Campaign Performance", group: "last30days" },
  { id: "16", title: "Technical Debt Assessment", group: "last30days" },
  { id: "17", title: "Onboarding Funnel Analysis", group: "last30days" },
  { id: "18", title: "Feature Adoption Metrics", group: "last30days" },
  { id: "19", title: "Customer Support Ticket Trends", group: "last30days" },
  { id: "20", title: "Market Opportunities Assessment", group: "older" },
  { id: "21", title: "Customer Journey Mapping Insigh...", group: "older" },
  { id: "22", title: "Brand Positioning Workshop", group: "older" },
  { id: "23", title: "Competitor Feature Comparison", group: "older" },
  { id: "24", title: "User Persona Development", group: "older" },
  { id: "25", title: "Content Strategy Planning", group: "older" },
  { id: "26", title: "API Usage Analytics", group: "older" },
  { id: "27", title: "Security Audit Findings", group: "older" },
  { id: "28", title: "Partnership Opportunities", group: "older" },
  { id: "29", title: "Platform Migration Strategy", group: "older" },
]

const groupLabels: Record<ChatGroup, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last30days: "Last 30 days",
  older: "Older",
}

const groupOrder: ChatGroup[] = ["today", "yesterday", "last30days", "older"]

export default function ChatSidebar() {
  const [chats, setChats] = useState<ChatItem[]>(initialChats)
  const [activeChat, setActiveChat] = useState<string>("1")
  const [message, setMessage] = useState("")
  const [animatingId, setAnimatingId] = useState<string | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [animationMode, setAnimationMode] = useState<AnimationMode>("smart")
  const chatRefs = useRef<Map<string, HTMLElement>>(new Map())
  const sidebarRef = useRef<HTMLElement>(null)

  const groupedChats = groupOrder.reduce(
    (acc, group) => {
      acc[group] = chats.filter((chat) => chat.group === group)
      return acc
    },
    {} as Record<ChatGroup, ChatItem[]>,
  )

  const handleChatClick = (id: string) => {
    setActiveChat(id)
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return

    const activeChatItem = chats.find((c) => c.id === activeChat)
    if (!activeChatItem) {
      setMessage("")
      return
    }

    const currentElement = chatRefs.current.get(activeChat)
    const startRect = currentElement?.getBoundingClientRect()
    const sidebarRect = sidebarRef.current?.getBoundingClientRect()

    // Calculate if element is in viewport
    const isInViewport =
      startRect && sidebarRect && startRect.top >= sidebarRect.top && startRect.bottom <= sidebarRect.bottom

    setAnimatingId(activeChat)

    // MODE 1: Fade Out/In
    if (animationMode === "fade") {
      if (currentElement) {
        currentElement.style.transition = "opacity 200ms ease-out"
        currentElement.style.opacity = "0"
      }

      setTimeout(() => {
        setChats((prevChats) => {
          const updatedChat = { ...activeChatItem, group: "today" as ChatGroup }
          const otherChats = prevChats.filter((chat) => chat.id !== activeChat)
          return [updatedChat, ...otherChats]
        })

        if (sidebarRef.current) {
          sidebarRef.current.scrollTop = 0
        }

        setTimeout(() => {
          const newElement = chatRefs.current.get(activeChat)
          if (newElement) {
            newElement.style.opacity = "0"
            newElement.style.transition = "opacity 300ms ease-in"

            requestAnimationFrame(() => {
              newElement.style.opacity = "1"
            })

            setTimeout(() => {
              newElement.style.transition = ""
              newElement.style.opacity = ""
              setAnimatingId(null)
              setHighlightId(activeChat)
              setTimeout(() => setHighlightId(null), 1000)
            }, 300)
          }
        }, 50)
      }, 200)
    }

    // MODE 2: Scroll Then Move
    else if (animationMode === "scroll-then-move") {
      if (currentElement && sidebarRef.current) {
        // First, scroll the element to the top
        currentElement.scrollIntoView({ behavior: "smooth", block: "start" })

        setTimeout(() => {
          const startRect = currentElement.getBoundingClientRect()

          setChats((prevChats) => {
            const updatedChat = { ...activeChatItem, group: "today" as ChatGroup }
            const otherChats = prevChats.filter((chat) => chat.id !== activeChat)
            return [updatedChat, ...otherChats]
          })

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const newElement = chatRefs.current.get(activeChat)
              const endRect = newElement?.getBoundingClientRect()

              if (startRect && endRect && newElement) {
                const deltaY = startRect.top - endRect.top

                if (sidebarRef.current) {
                  sidebarRef.current.scrollTop = 0
                }

                newElement.style.transform = `translateY(${deltaY}px)`
                newElement.style.transition = "none"
                newElement.offsetHeight

                newElement.style.transition = "transform 350ms ease-out"
                newElement.style.transform = "translateY(0)"

                setTimeout(() => {
                  newElement.style.transition = ""
                  newElement.style.transform = ""
                  setAnimatingId(null)
                  setHighlightId(activeChat)
                  setTimeout(() => setHighlightId(null), 1000)
                }, 350)
              }
            })
          })
        }, 600) // Wait for scroll to complete
      }
    }

    // MODE 3: Smart (distance-based)
    else if (animationMode === "smart") {
      if (!isInViewport) {
        // Use fade for off-screen items
        if (currentElement) {
          currentElement.style.transition = "opacity 200ms ease-out"
          currentElement.style.opacity = "0"
        }

        setTimeout(() => {
          setChats((prevChats) => {
            const updatedChat = { ...activeChatItem, group: "today" as ChatGroup }
            const otherChats = prevChats.filter((chat) => chat.id !== activeChat)
            return [updatedChat, ...otherChats]
          })

          if (sidebarRef.current) {
            sidebarRef.current.scrollTop = 0
          }

          setTimeout(() => {
            const newElement = chatRefs.current.get(activeChat)
            if (newElement) {
              newElement.style.opacity = "0"
              newElement.style.transition = "opacity 250ms ease-in"

              requestAnimationFrame(() => {
                newElement.style.opacity = "1"
              })

              setTimeout(() => {
                newElement.style.transition = ""
                newElement.style.opacity = ""
                setAnimatingId(null)
                setHighlightId(activeChat)
                setTimeout(() => setHighlightId(null), 1000)
              }, 250)
            }
          }, 50)
        }, 200)
      } else {
        // Use FLIP animation for visible items
        setChats((prevChats) => {
          const updatedChat = { ...activeChatItem, group: "today" as ChatGroup }
          const otherChats = prevChats.filter((chat) => chat.id !== activeChat)
          return [updatedChat, ...otherChats]
        })

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const newElement = chatRefs.current.get(activeChat)
            const endRect = newElement?.getBoundingClientRect()

            if (startRect && endRect && newElement) {
              const deltaY = startRect.top - endRect.top

              if (sidebarRef.current) {
                sidebarRef.current.scrollTop = 0
              }

              newElement.style.transform = `translateY(${deltaY}px)`
              newElement.style.transition = "none"
              newElement.offsetHeight

              newElement.style.transition = "transform 350ms ease-out"
              newElement.style.transform = "translateY(0)"

              setTimeout(() => {
                newElement.style.transition = ""
                newElement.style.transform = ""
                setAnimatingId(null)
                setHighlightId(activeChat)
                setTimeout(() => setHighlightId(null), 1000)
              }, 350)
            }
          })
        })
      }
    }

    // MODE 4: Teleport (instant with strong highlight)
    else if (animationMode === "teleport") {
      setChats((prevChats) => {
        const updatedChat = { ...activeChatItem, group: "today" as ChatGroup }
        const otherChats = prevChats.filter((chat) => chat.id !== activeChat)
        return [updatedChat, ...otherChats]
      })

      if (sidebarRef.current) {
        sidebarRef.current.scrollTop = 0
      }

      setTimeout(() => {
        setAnimatingId(null)
        setHighlightId(activeChat)
        setTimeout(() => setHighlightId(null), 1500) // Longer highlight for teleport
      }, 50)
    }

    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const activeTitle = chats.find((c) => c.id === activeChat)?.title || ""

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#f9f9f9",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: "#333" }}>
              All chats
            </Typography>
            <Box>
              <IconButton size="small" sx={{ mr: 0.5 }}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <TextField
            placeholder="Search"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#999", fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: "#fff",
                borderRadius: 1,
                fontSize: "14px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ccc",
                },
              },
            }}
          />
        </Box>

        <Box ref={sidebarRef} sx={{ flexGrow: 1, overflowY: "auto", px: 1 }}>
          {groupOrder.map((group) => {
            const groupChats = groupedChats[group]
            if (groupChats.length === 0) return null

            return (
              <Box key={group} sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    py: 1,
                    display: "block",
                    color: "#888",
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  {groupLabels[group]}
                </Typography>
                <List sx={{ p: 0 }}>
                  {groupChats.map((chat) => (
                    <ListItem
                      key={chat.id}
                      disablePadding
                      ref={(el) => {
                        if (el) chatRefs.current.set(chat.id, el)
                      }}
                      sx={{
                        mb: 0.5,
                        position: "relative",
                        "&::before":
                          highlightId === chat.id
                            ? {
                                content: '""',
                                position: "absolute",
                                inset: 0,
                                bgcolor: "rgba(25, 118, 210, 0.08)",
                                borderRadius: 1,
                                animation:
                                  animationMode === "teleport"
                                    ? "highlight-pulse-strong 1.5s ease-out"
                                    : "highlight-pulse 1s ease-out",
                              }
                            : {},
                        "@keyframes highlight-pulse": {
                          "0%": { bgcolor: "rgba(25, 118, 210, 0.15)" },
                          "100%": { bgcolor: "rgba(25, 118, 210, 0.02)" },
                        },
                        "@keyframes highlight-pulse-strong": {
                          "0%": { bgcolor: "rgba(25, 118, 210, 0.3)", boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.3)" },
                          "50%": {
                            bgcolor: "rgba(25, 118, 210, 0.15)",
                            boxShadow: "0 0 0 1px rgba(25, 118, 210, 0.2)",
                          },
                          "100%": { bgcolor: "rgba(25, 118, 210, 0.02)", boxShadow: "none" },
                        },
                      }}
                    >
                      <ListItemButton
                        selected={activeChat === chat.id}
                        onClick={() => handleChatClick(chat.id)}
                        sx={{
                          borderRadius: 1,
                          px: 1.5,
                          py: 1,
                          minHeight: 40,
                          "&.Mui-selected": {
                            bgcolor: "#e8e8e8",
                            "&:hover": {
                              bgcolor: "#e0e0e0",
                            },
                          },
                          "&:hover": {
                            bgcolor: "#f0f0f0",
                          },
                        }}
                      >
                        <ListItemText
                          primary={chat.title}
                          primaryTypographyProps={{
                            sx: {
                              fontSize: "14px",
                              color: "#333",
                              fontWeight: activeChat === chat.id ? 500 : 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )
          })}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
        {/* Header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>
              {activeTitle}
            </Typography>
            <Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ShareIcon />}
                sx={{
                  textTransform: "none",
                  color: "#666",
                  borderColor: "#e0e0e0",
                  mr: 1,
                  "&:hover": {
                    borderColor: "#ccc",
                    bgcolor: "#f9f9f9",
                  },
                }}
              >
                Share
              </Button>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Chat Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="body1" sx={{ color: "#999", textAlign: "center" }}>
            Select a chat and send a message to see the recency sort animation
          </Typography>
          <Box sx={{ bgcolor: "#f9f9f9", p: 2, borderRadius: 2, maxWidth: 600 }}>
            <Typography
              variant="caption"
              sx={{ color: "#666", fontSize: "12px", display: "block", mb: 1, fontWeight: 500 }}
            >
              Animation Modes:
            </Typography>
            <Typography variant="caption" sx={{ color: "#666", fontSize: "11px", display: "block", mb: 0.5 }}>
              <strong>Fade:</strong> Simple fade out/in transition
            </Typography>
            <Typography variant="caption" sx={{ color: "#666", fontSize: "11px", display: "block", mb: 0.5 }}>
              <strong>Scroll:</strong> Smoothly scroll item into view, then animate to top
            </Typography>
            <Typography variant="caption" sx={{ color: "#666", fontSize: "11px", display: "block", mb: 0.5 }}>
              <strong>Smart:</strong> FLIP animation for visible items, fade for off-screen
            </Typography>
            <Typography variant="caption" sx={{ color: "#666", fontSize: "11px", display: "block" }}>
              <strong>Teleport:</strong> Instant move with strong highlight effect
            </Typography>
          </Box>
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            borderTop: "1px solid #e0e0e0",
            p: 3,
            bgcolor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 2,
              maxWidth: 800,
              mx: "auto",
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Ask a follow up"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#fff",
                  fontSize: "14px",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ccc",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!message.trim()}
              sx={{
                bgcolor: message.trim() ? "#1976d2" : "#e0e0e0",
                color: "#fff",
                "&:hover": {
                  bgcolor: message.trim() ? "#1565c0" : "#e0e0e0",
                },
                "&.Mui-disabled": {
                  bgcolor: "#e0e0e0",
                  color: "#999",
                },
                width: 40,
                height: 40,
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
